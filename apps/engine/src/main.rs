mod engine;
mod model;
mod routes;
mod safe_delete;
mod safety;
mod state;
mod torrent_file;

use axum::Router;
use routes::router;
use state::AppState;
use std::net::SocketAddr;
use tower_http::trace::TraceLayer;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    tracing_subscriber::fmt::init();

    let state = AppState::new_dev();
    let app: Router = router(state).layer(TraceLayer::new_for_http());

    let port = std::env::var("LUMATORRENT_ENGINE_PORT")
        .ok()
        .and_then(|value| value.parse::<u16>().ok())
        .unwrap_or(17391);
    // Critical safety property: bind localhost only. Remote dashboard must be a separate opt-in feature.
    let addr = SocketAddr::from(([127, 0, 0, 1], port));
    let listener = tokio::net::TcpListener::bind(addr).await?;

    tracing::info!("engine listening on 127.0.0.1:{}", port);
    axum::serve(listener, app).await?;
    Ok(())
}
