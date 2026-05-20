const http = require('http');
const CLICKUP_API_KEY = 'pk_108004485_WP9UM93M00FT2X1Z6T5H4TUE9LBWVTHL';
const CLICKUP_LIST_ID = '901104473097';
const AZURE_CLIENT_ID = '29aca025-6d28-49e6-9a7a-9a46a9917df5';
const AZURE_CLIENT_SECRET = 'yOV8Q~pn9pstX5NbGClfee.OaOlPJP~P92HNfbS2';
const AZURE_TENANT_ID = 'fa339a17-9a02-4d91-8534-5ea2cb6aea4c';
const ONEDRIVE_USER_EMAIL = 'info@myhomefinish.com';
const TEMPLATE_FILE_NAME = 'Upstate New Main Sheet.xlsx';
const TEMPLATE_FOLDER = 'Upstate Estimates';
const server = http.createServer((req, res) => {
res.writeHead(200, {'Content-Type': 'text/plain'});
res.end('Integration is running!');
});
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(Running on port ${PORT}));
