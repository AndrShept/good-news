import type { Context, Next } from 'hono';
import { Style, css } from 'hono/css';

import { isMaintance } from '..';
import { html } from 'hono/html';

export const maintance = async (c: Context, next: Next) => {
  const containerClass = css`
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background: #0f172a;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    margin: 0;
  `;

  const cardClass = css`
    background: #1e293b;
    padding: 3rem 4rem;
    border-radius: 20px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    text-align: center;
    max-width: 500px;
    border: 1px solid #334155;
  `;

  const iconClass = css`
    font-size: 4rem;
    margin-bottom: 1.5rem;
    animation: pulse 2s ease-in-out infinite;
    @keyframes pulse {
      0%,
      100% {
        transform: scale(1);
        opacity: 1;
      }
      50% {
        transform: scale(1.1);
        opacity: 0.8;
      }
    }
  `;

  const titleClass = css`
    color: #f1f5f9;
    font-size: 2rem;
    font-weight: 700;
    margin: 0 0 1rem 0;
  `;

  const messageClass = css`
    color: #94a3b8;
    font-size: 1.1rem;
    line-height: 1.6;
    margin: 0;
  `;

  const statusClass = css`
    display: inline-block;
    background: #3b82f6;
    color: white;
    padding: 0.5rem 1.5rem;
    border-radius: 20px;
    font-size: 0.875rem;
    font-weight: 600;
    margin-top: 1.5rem;
  `;
  console.log(c.req.path);
  if (isMaintance && c.req.path !== '/restart') {
    return c.html(html`SERVER MAINTANCE 503`,
      // <html lang="en">
      //   <head>
      //     <meta charset="UTF-8" />
      //     <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      //     <title>Server Restart in Progress</title>
      //     <Style />
      //   </head>
      //   <body>
      //     <div class={containerClass}>
      //       <div class={cardClass}>
      //         <div class={iconClass}>🔄</div>
      //         <h1 class={titleClass}>Server Restart</h1>
      //         <p class={messageClass}>The server is currently restarting. We'll be back online shortly.</p>
      //         <div class={statusClass}>503 - Service Unavailable</div>
      //       </div>
      //     </div>
      //   </body>
      // </html>,
      503,
    );
  }

  await next();
};
