upstream express {
  server 127.0.0.1:9000;
  server 127.0.0.1:9001 weight=2;
  server 127.0.0.1:9002 down;
}

server {
  listen 0.0.0.0:80;

  server_name .talk.com;

  access_log /var/log/nginx/talk.access.log;
  error_log /var/log/nginx/talk.error.log;

  location / {
    proxy_pass http://express;
    proxy_redirect off;

    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header Host $http_host;
    proxy_set_header X-NginX-Proxy true;
  }

  location ~ ^/(artwork/|static/|assets/|uploads/|robots.txt|sitemap.xml) {
    root /var/app/talk/public;
    access_log off;
    expires max;
    add_header Pragma public;
    add_header Cache-Control "public, must-revalidate, proxy-revalidate";
  }

  location = /favicon.ico {
    alias    /var/app/talk/artwork/favicon/favicon.ico;
  }

  gzip_static on;
}