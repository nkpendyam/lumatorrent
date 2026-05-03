mod model;
mod routes;
mod safety;
mod state;

use axum::Router;
use routes::router;
use std::net::SocketAddr;
use state::AppState;
use tower_http::trace::TraceLayer;

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();

    let state = AppState::new_dev();
    let app: Router = router(state).layer(TraceLayer::new_for_http());

    // Critical safety property: bind localhost only. Remote dashboard must be a separate opt-in feature.
    let addr = SocketAddr::from(([127, 0, 0, 1], 17391));
    let listener = tokio::net::TcpListener::bind(addr)
        .await
        .expect("engine must bind localhost");

    tracing::info!("engine listening on {}", addr);
    axum::serve(listener, app)
        .await
        .expect("engine server failed");
}
