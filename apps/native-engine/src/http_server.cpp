#include "lumatorrent/http_server.hpp"
#include "lumatorrent/security.hpp"

#include <array>
#include <cctype>
#include <cstdint>
#include <cstring>
#include <iostream>
#include <sstream>
#include <string>

#ifdef _WIN32
#ifndef WIN32_LEAN_AND_MEAN
#define WIN32_LEAN_AND_MEAN
#endif
#include <winsock2.h>
#include <ws2tcpip.h>
using socket_handle = SOCKET;
constexpr socket_handle invalid_socket_handle = INVALID_SOCKET;
#else
#include <arpa/inet.h>
#include <netinet/in.h>
#include <sys/socket.h>
#include <unistd.h>
using socket_handle = int;
constexpr socket_handle invalid_socket_handle = -1;
#endif

namespace lumatorrent {
namespace {

void close_socket(socket_handle socket) {
#ifdef _WIN32
  closesocket(socket);
#else
  close(socket);
#endif
}

std::string header_value(const std::string& request, const std::string& header_name) {
  std::istringstream lines(request);
  std::string line;
  const auto wanted = header_name + ":";
  while (std::getline(lines, line)) {
    if (!line.empty() && line.back() == '\r') line.pop_back();
    if (line.size() >= wanted.size() && line.compare(0, wanted.size(), wanted) == 0) {
      auto value = line.substr(wanted.size());
      while (!value.empty() && value.front() == ' ') value.erase(value.begin());
      return value;
    }
  }
  return "";
}

std::string request_target(const std::string& request) {
  const auto first_line_end = request.find("\r\n");
  const auto first_line = request.substr(0, first_line_end);
  std::istringstream stream(first_line);
  std::string method;
  std::string target;
  stream >> method >> target;
  return target;
}

std::string request_method(const std::string& request) {
  const auto first_line_end = request.find("\r\n");
  const auto first_line = request.substr(0, first_line_end);
  std::istringstream stream(first_line);
  std::string method;
  stream >> method;
  return method;
}

std::string request_body(const std::string& request) {
  const auto marker = request.find("\r\n\r\n");
  if (marker == std::string::npos) return "";
  return request.substr(marker + 4);
}

std::string target_path(const std::string& target) {
  const auto query = target.find('?');
  return query == std::string::npos ? target : target.substr(0, query);
}

std::string query_param(const std::string& target, const std::string& name) {
  const auto query_start = target.find('?');
  if (query_start == std::string::npos) return "";
  const auto query = target.substr(query_start + 1);
  const auto wanted = name + "=";
  std::size_t start = 0;
  while (start <= query.size()) {
    const auto end = query.find('&', start);
    const auto part = query.substr(start, end == std::string::npos ? std::string::npos : end - start);
    if (part.rfind(wanted, 0) == 0) return part.substr(wanted.size());
    if (end == std::string::npos) break;
    start = end + 1;
  }
  return "";
}

unsigned long long parse_unsigned_or_default(const std::string& value, unsigned long long fallback) {
  if (value.empty()) return fallback;
  try {
    return std::stoull(value);
  } catch (...) {
    return fallback;
  }
}

std::string path_after_prefix(const std::string& path, const std::string& prefix) {
  if (path.rfind(prefix, 0) != 0) return "";
  return path.substr(prefix.size());
}

std::string path_segment_before_suffix(
  const std::string& path,
  const std::string& prefix,
  const std::string& suffix
) {
  const auto tail = path_after_prefix(path, prefix);
  if (tail.empty() || tail.size() <= suffix.size()) return "";
  if (tail.compare(tail.size() - suffix.size(), suffix.size(), suffix) != 0) return "";
  return tail.substr(0, tail.size() - suffix.size());
}

std::string json_string_field(const std::string& body, const std::string& field) {
  const auto key = "\"" + field + "\"";
  auto pos = body.find(key);
  if (pos == std::string::npos) return "";
  pos = body.find(':', pos + key.size());
  if (pos == std::string::npos) return "";
  ++pos;
  while (pos < body.size() && std::isspace(static_cast<unsigned char>(body[pos]))) ++pos;
  if (pos >= body.size() || body[pos] != '"') return "";
  ++pos;

  std::string value;
  while (pos < body.size()) {
    const auto ch = body[pos++];
    if (ch == '"') return value;
    if (ch == '\\' && pos < body.size()) {
      const auto escaped = body[pos++];
      switch (escaped) {
        case '"': value.push_back('"'); break;
        case '\\': value.push_back('\\'); break;
        case '/': value.push_back('/'); break;
        case 'b': value.push_back('\b'); break;
        case 'f': value.push_back('\f'); break;
        case 'n': value.push_back('\n'); break;
        case 'r': value.push_back('\r'); break;
        case 't': value.push_back('\t'); break;
        default: value.push_back(escaped); break;
      }
    } else {
      value.push_back(ch);
    }
  }
  return "";
}

void send_json(socket_handle client, int status, const std::string& reason, const std::string& body) {
  std::ostringstream response;
  response << "HTTP/1.1 " << status << " " << reason << "\r\n"
           << "Content-Type: application/json\r\n"
           << "Content-Length: " << body.size() << "\r\n"
           << "Connection: close\r\n\r\n"
           << body;
  const auto payload = response.str();
  send(client, payload.c_str(), static_cast<int>(payload.size()), 0);
}

int engine_response_status(const std::string& response) {
  if (response.find("\"torrentId\"") != std::string::npos) return 202;
  if (response.find("\"code\":\"DUPLICATE_TORRENT\"") != std::string::npos) return 409;
  return 400;
}

void handle_client(socket_handle client, const std::string& token, EngineSession& session) {
  std::array<char, 8192> buffer{};
  const auto received = recv(client, buffer.data(), static_cast<int>(buffer.size() - 1), 0);
  if (received <= 0) return;

  const std::string request(buffer.data(), static_cast<std::size_t>(received));
  if (header_value(request, "X-Luma-Engine-Token") != token) {
    send_json(client, 401, "Unauthorized", R"({"error":"unauthorized"})");
    return;
  }
  if (header_value(request, "X-Luma-Engine-Version") != "v1") {
    send_json(
      client,
      400,
      "Bad Request",
      R"({"code":"ENGINE_UNAVAILABLE","message":"Engine API version header is missing or unsupported.","recoverable":true})"
    );
    return;
  }

  const auto method = request_method(request);
  const auto target = request_target(request);
  const auto path = target_path(target);
  if (method == "GET" && (path == "/v1/health" || path == "/health")) {
    send_json(client, 200, "OK", session.health_json());
    return;
  }
  if (method == "GET" && path == "/v1/torrents") {
    send_json(client, 200, "OK", session.list_torrents_json());
    return;
  }
  if (method == "GET" && path == "/v1/events") {
    const auto after = parse_unsigned_or_default(query_param(target, "after"), 0);
    const auto limit = static_cast<unsigned int>(parse_unsigned_or_default(query_param(target, "limit"), 1024));
    send_json(client, 200, "OK", session.events_json(after, limit));
    return;
  }
  if (method == "POST" && path == "/v1/torrents/magnet") {
    const auto body = request_body(request);
    const auto magnet_uri = json_string_field(body, "magnetUri");
    const auto save_path = json_string_field(body, "savePath");
    const auto response = session.add_magnet(magnet_uri, save_path);
    const auto status = engine_response_status(response);
    const auto reason = status == 202 ? "Accepted" : status == 409 ? "Conflict" : "Bad Request";
    send_json(client, status, reason, response);
    return;
  }
  if (method == "POST" && path == "/v1/torrents/file") {
    const auto body = request_body(request);
    const auto torrent_file_path = json_string_field(body, "torrentFilePath");
    const auto save_path = json_string_field(body, "savePath");
    const auto response = session.add_torrent_file(torrent_file_path, save_path);
    const auto status = engine_response_status(response);
    const auto reason = status == 202 ? "Accepted" : status == 409 ? "Conflict" : "Bad Request";
    send_json(client, status, reason, response);
    return;
  }
  if (method == "POST") {
    const auto pause_id = path_segment_before_suffix(path, "/v1/torrents/", "/pause");
    if (!pause_id.empty()) {
      if (session.pause(pause_id)) {
        send_json(client, 200, "OK", R"({"ok":true})");
      } else {
        send_json(client, 404, "Not Found", R"({"code":"ENGINE_UNAVAILABLE","message":"Torrent was not found.","recoverable":true})");
      }
      return;
    }

    const auto resume_id = path_segment_before_suffix(path, "/v1/torrents/", "/resume");
    if (!resume_id.empty()) {
      if (session.resume(resume_id)) {
        send_json(client, 200, "OK", R"({"ok":true})");
      } else {
        send_json(client, 404, "Not Found", R"({"code":"ENGINE_UNAVAILABLE","message":"Torrent was not found.","recoverable":true})");
      }
      return;
    }

    const auto remove_id = path_segment_before_suffix(path, "/v1/torrents/", "/remove");
    if (!remove_id.empty()) {
      if (session.remove(remove_id, false)) {
        send_json(client, 200, "OK", R"({"ok":true,"removedFromApp":true,"filesTrashed":[],"filesMissing":[]})");
      } else {
        send_json(client, 404, "Not Found", R"({"code":"ENGINE_UNAVAILABLE","message":"Torrent was not found.","recoverable":true})");
      }
      return;
    }
  }

  send_json(client, 404, "Not Found", R"({"error":"not_found"})");
}

} // namespace

int run_loopback_http_server(
  const std::string& host,
  std::uint16_t port,
  const std::string& token,
  EngineSession& session
) {
  if (!is_loopback_bind_address(host)) {
    std::cerr << "Refusing to serve native engine on non-loopback host: " << host << "\n";
    return 2;
  }

#ifdef _WIN32
  WSADATA data{};
  if (WSAStartup(MAKEWORD(2, 2), &data) != 0) {
    std::cerr << "Failed to initialize Winsock.\n";
    return 4;
  }
#endif

  socket_handle server = socket(AF_INET, SOCK_STREAM, IPPROTO_TCP);
  if (server == invalid_socket_handle) {
    std::cerr << "Failed to create native engine server socket.\n";
#ifdef _WIN32
    WSACleanup();
#endif
    return 4;
  }

  sockaddr_in address{};
  address.sin_family = AF_INET;
  address.sin_port = htons(port);
  inet_pton(AF_INET, "127.0.0.1", &address.sin_addr);

  const int reuse = 1;
#ifdef _WIN32
  setsockopt(server, SOL_SOCKET, SO_REUSEADDR, reinterpret_cast<const char*>(&reuse), sizeof(reuse));
#else
  setsockopt(server, SOL_SOCKET, SO_REUSEADDR, &reuse, sizeof(reuse));
#endif

  if (bind(server, reinterpret_cast<sockaddr*>(&address), sizeof(address)) != 0) {
    std::cerr << "Failed to bind native engine server on 127.0.0.1:" << port << ".\n";
    close_socket(server);
#ifdef _WIN32
    WSACleanup();
#endif
    return 4;
  }

  if (listen(server, 16) != 0) {
    std::cerr << "Failed to listen on native engine server socket.\n";
    close_socket(server);
#ifdef _WIN32
    WSACleanup();
#endif
    return 4;
  }

  std::cout << "native engine HTTP server ready on 127.0.0.1:" << port << "\n";
  while (true) {
    socket_handle client = accept(server, nullptr, nullptr);
    if (client == invalid_socket_handle) continue;
    handle_client(client, token, session);
    close_socket(client);
  }
}

} // namespace lumatorrent
