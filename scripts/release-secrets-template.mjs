const secrets = ['TAURI_PRIVATE_KEY','TAURI_KEY_PASSWORD','APPLE_ID','APPLE_PASSWORD','APPLE_TEAM_ID','WINDOWS_CERTIFICATE_BASE64','WINDOWS_CERTIFICATE_PASSWORD'];
console.log('# Required release secrets');
for (const s of secrets) console.log(`- ${s}`);
console.log('\nNever commit real values. Configure them in GitHub Actions secrets or environment secrets.');
