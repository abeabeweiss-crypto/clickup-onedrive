const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());
const CLICKUP_API_KEY = 'pk_108004485_WP9UM93M00FT2X1Z6T5H4TUE9LBWVTHL';
const CLICKUP_LIST_ID = '901104473097';
const AZURE_CLIENT_ID = '29aca025-6d28-49e6-9a7a-9a46a9917df5';
const AZURE_CLIENT_SECRET = 'yOV8Q~pn9pstX5NbGClfee.OaOlPJP~P92HNfbS2';
const AZURE_TENANT_ID = 'fa339a17-9a02-4d91-8534-5ea2cb6aea4c';
const ONEDRIVE_USER_EMAIL = 'info@myhomefinish.com';
const TEMPLATE_FILE_NAME = 'Upstate New Main Sheet.xlsx';
const TEMPLATE_FOLDER = 'Upstate Estimates';
const DESTINATION_FOLDER = 'Upstate Estimates';
async function getMicrosoftToken() {
const r = await fetch(https://login.microsoftonline.com/${AZURE_TENANT_ID}/oauth2/v2.0/token, {
method: 'POST',
body: new URLSearchParams({
client_id: AZURE_CLIENT_ID,
client_secret: AZURE_CLIENT_SECRET,
scope: 'https://graph.microsoft.com/.default',
grant_type: 'client_credentials'
})
});
const d = await r.json();
return d.access_token;
}
async function getClickUpTask(taskId) {
const r = await fetch(https://api.clickup.com/api/v2/task/${taskId}, {
headers: { Authorization: CLICKUP_API_KEY }
});
return r.json();
}
async function copyFileInOneDrive(token, customerName) {
const t = await fetch(https://graph.microsoft.com/v1.0/users/${ONEDRIVE_USER_EMAIL}/drive/root:/${TEMPLATE_FOLDER}/${TEMPLATE_FILE_NAME}, {
headers: { Authorization: Bearer ${token} }
});
const td = await t.json();
const f = await fetch(https://graph.microsoft.com/v1.0/users/${ONEDRIVE_USER_EMAIL}/drive/root:/${DESTINATION_FOLDER}, {
headers: { Authorization: Bearer ${token} }
});
const fd = await f.json();
await fetch(https://graph.microsoft.com/v1.0/users/${ONEDRIVE_USER_EMAIL}/drive/items/${td.id}/copy, {
method: 'POST',
headers: { Authorization: Bearer ${token}, 'Content-Type': 'application/json' },
body: JSON.stringify({ name: ${customerName}.xlsx, parentReference: { driveId: td.parentReference.driveId, id: fd.id } })
});
await new Promise(r => setTimeout(r, 4000));
const nf = await fetch(https://graph.microsoft.com/v1.0/users/${ONEDRIVE_USER_EMAIL}/drive/root:/${DESTINATION_FOLDER}/${customerName}.xlsx, {
headers: { Authorization: Bearer ${token} }
});
const nfd = await nf.json();
return nfd.webUrl;
}
async function postClickUpComment(taskId, customerName, fileUrl) {
await fetch(https://api.clickup.com/api/v2/task/${taskId}/comment, {
method: 'POST',
headers: { Authorization: CLICKUP_API_KEY, 'Content-Type': 'application/json' },
body: JSON.stringify({ comment_text: Estimate Sheet for ${customerName}: ${fileUrl} })
});
}
app.post('/webhook', async (req, res) => {
res.status(200).send('OK');
const { event, task_id, list_id } = req.body;
if (event === 'taskCreated' && list_id === CLICKUP_LIST_ID) {
try {
const task = await getClickUpTask(task_id);
const customerName = task.name;
const token = await getMicrosoftToken();
const fileUrl = await copyFileInOneDrive(token, customerName);
await postClickUpComment(task_id, customerName, fileUrl);
console.log(Done: ${customerName});
} catch (e) {
console.error(e);
}
}
});
app.get('/', (req, res) => res.send('Integration is running!'));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(Running on port ${PORT}));
