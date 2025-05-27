let sessionUser = null;
let sessionPass = null;

async function login() {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  const status = document.getElementById('status');

  if (!username || !password) {
    status.textContent = "❗ Please fill in all fields.";
    return;
  }

  try {
    const res = await fetch('https://arch-vm-daniel.tail7892af.ts.net/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    if (!res.ok) {
      const msg = await res.text();
      status.textContent = `❌ ${msg}`;
      return;
    }

    sessionUser = username;
    sessionPass = password;

    document.getElementById('login-section').style.display = 'none';
    document.getElementById('report-section').style.display = 'block';
    document.getElementById('user-label').textContent = username;

    status.textContent = "✅ Logged in!";
  } catch (err) {
    status.textContent = "❌ Network error.";
  }
}

async function loadReport() {
  const status = document.getElementById('status');
  const output = document.getElementById('output');

  if (!sessionUser || !sessionPass) {
    status.textContent = "❗ Not logged in.";
    return;
  }

  status.textContent = "📡 Loading report...";
  output.textContent = "";

  try {
    const res = await fetch(`https://arch-vm-daniel.tail7892af.ts.net/file?username=${encodeURIComponent(sessionUser)}&filename=scan_report.json`);

    if (!res.ok) {
      const msg = await res.text();
      status.textContent = `❌ ${msg}`;
      return;
    }

    const json = await res.json();
    output.textContent = JSON.stringify(json, null, 2);
    status.textContent = "✅ Report loaded!";
  } catch (err) {
    console.error(err);
    status.textContent = "❌ Could not fetch file.";
  }
}
