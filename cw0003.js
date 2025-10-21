// Enhanced Chat Widget Script with XXL Clean Minimal Launcher (cw0003.js)
(function() {
    // ---------- NEW CONFIG (non-breaking) ----------
    const defaultLauncher = {
        enabled: false,                 // set true to enable XXL Clean Minimal
        variant: 'xxl-clean',           // future-proof
        phrases: ['Hello, I’m Savoir', 'I’m here to help'],
        pill: true,                     // show the white message pill
        corner: 'right',                // 'right' | 'left' (uses existing position too)
        size: 100                       // diameter in px for XXL circle
    };

    // ---------- EXISTING STYLES + NEW XXL STYLES ----------
    const styles = `
        .n8n-chat-widget {
            --chat--color-primary: var(--n8n-chat-primary-color, #854fff);
            --chat--color-secondary: var(--n8n-chat-secondary-color, #6b3fd4);
            --chat--color-background: var(--n8n-chat-background-color, #ffffff);
            --chat--color-font: var(--n8n-chat-font-color, #333333);
            font-family: 'Geist Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        }

        .n8n-chat-widget .new-conversation {
            display: flex;
            flex-direction: column;
            align-items: stretch;
            width: 100%;
            max-width: 300px;
            box-sizing: border-box;
            padding: 0 0 12px 0;
        }

        .n8n-chat-widget .chat-text-input,
        .n8n-chat-widget .new-chat-btn {
            width: 100%;
            box-sizing: border-box;
        }

        .n8n-chat-widget .chat-container {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 1000;
            display: none;
            width: 380px;
            height: 600px;
            background: var(--chat--color-background);
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(133, 79, 255, 0.15);
            border: 1px solid rgba(133, 79, 255, 0.2);
            overflow: hidden;
            font-family: inherit;
        }
        .n8n-chat-widget .chat-container.position-left { right: auto; left: 20px; }
        .n8n-chat-widget .chat-container.open { display: flex; flex-direction: column; }

        .n8n-chat-widget .brand-header {
            padding: 16px; display: flex; align-items: center; gap: 12px;
            border-bottom: 1px solid rgba(133, 79, 255, 0.1); position: relative;
        }

        .n8n-chat-widget .close-button {
            position: absolute; right: 16px; top: 50%; transform: translateY(-50%);
            background: none; border: none; color: var(--chat--color-font);
            cursor: pointer; padding: 4px; display: flex; align-items: center; justify-content: center;
            transition: color 0.2s; font-size: 20px; opacity: 0.6;
        }
        .n8n-chat-widget .close-button:hover { opacity: 1; }

        .n8n-chat-widget .brand-header img { width: 32px; height: 32px; }
        .n8n-chat-widget .brand-header span { font-size: 18px; font-weight: 500; color: var(--chat--color-font); }

        .n8n-chat-widget .new-conversation { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); padding:20px; text-align:center; width:100%; max-width:300px; }
        .n8n-chat-widget .welcome-text { font-size: 24px; font-weight: 600; color: var(--chat--color-font); margin-bottom: 24px; line-height: 1.3; }

        .n8n-chat-widget .new-chat-btn {
            display:flex; align-items:center; justify-content:center; gap:8px; width:100%;
            padding:16px 24px; background:linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
            color:#fff; border:none; border-radius:8px; cursor:pointer; font-size:16px; transition:transform .3s; font-weight:500; font-family:inherit; margin-bottom:12px;
        }
        .n8n-chat-widget .new-chat-btn:hover { transform: scale(1.02); }
        .n8n-chat-widget .message-icon { width:20px; height:20px; }
        .n8n-chat-widget .response-text { font-size:14px; color:var(--chat--color-font); opacity:.7; margin:0; }

        .n8n-chat-widget .chat-interface { display:none; flex-direction:column; height:100%; }
        .n8n-chat-widget .chat-interface.active { display:flex; }
        .n8n-chat-widget .chat-messages { flex:1; overflow-y:auto; padding:20px; background:var(--chat--color-background); display:flex; flex-direction:column; }

        .n8n-chat-widget .chat-message {
            padding:12px 16px; margin:8px 0; border-radius:12px; max-width:80%; word-wrap:break-word;
            font-size:14px; line-height:1.5; white-space:pre-wrap; opacity:0; transform:translateY(10px);
            animation: messageSlideIn .3s ease-out forwards;
        }
        .n8n-chat-widget .chat-message a{ color:var(--chat--color-primary); text-decoration:underline; transition:all .2s ease; font-weight:500; }
        .n8n-chat-widget .chat-message a:hover{ color:var(--chat--color-secondary); text-decoration:none; background-color:rgba(133,79,255,.1); padding:2px 4px; border-radius:4px; margin:-2px -4px; }
        .n8n-chat-widget .chat-message.user a{ color:rgba(255,255,255,.9); }
        .n8n-chat-widget .chat-message.user a:hover{ color:#fff; background-color:rgba(255,255,255,.2); }

        @keyframes messageSlideIn { to { opacity:1; transform:translateY(0); } }

        .n8n-chat-widget .chat-message.user {
            background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
            color:#fff; align-self:flex-end; box-shadow:0 4px 12px rgba(133,79,255,.2); border:none;
        }
        .n8n-chat-widget .chat-message.bot {
            background: var(--chat--color-background); border:1px solid rgba(133,79,255,.2);
            color:var(--chat--color-font); align-self:flex-start; box-shadow:0 4px 12px rgba(0,0,0,.05);
        }

        .n8n-chat-widget .typing-indicator { display:flex; align-items:center; padding:12px 16px; margin:8px 0; border-radius:12px; max-width:80%; background:var(--chat--color-background); border:1px solid rgba(133,79,255,.2); align-self:flex-start; box-shadow:0 4px 12px rgba(0,0,0,.05); }
        .n8n-chat-widget .typing-dots { display:flex; gap:4px; align-items:center; }
        .n8n-chat-widget .typing-dot { width:8px; height:8px; border-radius:50%; background-color:var(--chat--color-primary); opacity:.5; animation: typingDot 1.4s infinite ease-in-out; }
        .n8n-chat-widget .typing-dot:nth-child(1){ animation-delay:-.32s; }
        .n8n-chat-widget .typing-dot:nth-child(2){ animation-delay:-.16s; }
        .n8n-chat-widget .typing-dot:nth-child(3){ animation-delay:0s; }
        @keyframes typingDot { 0%,80%,100%{opacity:.5; transform:scale(.8);} 40%{opacity:1; transform:scale(1);} }

        .n8n-chat-widget .chat-input { padding:16px; background:var(--chat--color-background); border-top:1px solid rgba(133,79,255,.1); display:flex; gap:8px; }
        .n8n-chat-widget .chat-text-input { display:block; width:100%; box-sizing:border-box; padding:16px 24px; border:1px solid rgba(133,79,255,.2); border-radius:8px; background:var(--chat--color-background); color:var(--chat--color-font); font-family:inherit; font-size:14px; margin-bottom:8px; }
        .n8n-chat-widget .chat-input textarea { flex:1; padding:12px; border:1px solid rgba(133,79,255,.2); border-radius:8px; background:var(--chat--color-background); color:var(--chat--color-font); resize:none; font-family:inherit; font-size:14px; }
        .n8n-chat-widget .chat-input textarea::placeholder{ color:var(--chat--color-font); opacity:.6; }
        .n8n-chat-widget .chat-input textarea:disabled{ opacity:.6; cursor:not-allowed; }
        .n8n-chat-widget .chat-input button{ background:linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%); color:#fff; border:none; border-radius:8px; padding:0 20px; cursor:pointer; transition:transform .2s; font-family:inherit; font-weight:500; }
        .n8n-chat-widget .chat-input button:hover:not(:disabled){ transform:scale(1.05); }
        .n8n-chat-widget .chat-input button:disabled{ opacity:.6; cursor:not-allowed; transform:none; }

        .n8n-chat-widget .chat-toggle {
            position: fixed; bottom: 20px; right: 20px; width: 60px; height: 60px; border-radius: 30px;
            background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
            color: #fff; border: none; cursor: pointer; box-shadow: 0 4px 12px rgba(133,79,255,.3); z-index: 999;
            transition: transform .3s; display:flex; align-items:center; justify-content:center;
        }
        .n8n-chat-widget .chat-toggle.position-left{ right:auto; left:20px; }
        .n8n-chat-widget .chat-toggle:hover{ transform:scale(1.05); }
        .n8n-chat-widget .chat-toggle svg{ width:24px; height:24px; fill:currentColor; }

        .n8n-chat-widget .chat-footer{ padding:8px; text-align:center; background:var(--chat--color-background); border-top:1px solid rgba(133,79,255,.1); }
        .n8n-chat-widget .chat-footer a{ color:var(--chat--color-primary); text-decoration:none; font-size:12px; opacity:.8; transition:opacity .2s; font-family:inherit; }
        .n8n-chat-widget .chat-footer a:hover{ opacity:1; }

        .n8n-chat-widget .chat-text-input.hidden{ display:none; }

        .n8n-chat-widget .message-buttons{ display:flex; flex-direction:column; gap:8px; margin-top:12px; }
        .n8n-chat-widget .message-buttons button{
            padding:12px 16px; border:none; border-radius:8px;
            background:linear-gradient(135deg,#A69856 0%, #8A7D47 100%); color:#fff; font-size:14px; font-weight:500; cursor:pointer;
            transition:all .3s ease; box-shadow:0 2px 8px rgba(166,152,86,.2); font-family:inherit;
        }
        .n8n-chat-widget .message-buttons button:hover{ transform:translateY(-2px); box-shadow:0 6px 20px rgba(166,152,86,.4); }
        .n8n-chat-widget .message-buttons button.selected{ opacity:.8; transform:scale(.98); }
        .n8n-chat-widget .message-buttons button:disabled{ cursor:not-allowed!important; opacity:.6; }
        .n8n-chat-widget .message-buttons button:disabled:hover{ transform:none!important; box-shadow:0 2px 8px rgba(166,152,86,.2)!important; }

        /* ---------- NEW: XXL Clean Minimal Launcher ---------- */
        .n8n-chat-widget .savoir-fixed{
            position:fixed; right:32px; bottom:32px;
            pointer-events:none; z-index:2147483000;
            display:block; width:auto; height:auto;
        }
        .n8n-chat-widget .savoir-fixed.left{ right:auto; left:32px; }
        .n8n-chat-widget .savoir-fixed[data-state="open"]{ display:none; }

        .n8n-chat-widget .chat-widget-xxl{
            pointer-events:auto; position:absolute; right:0; bottom:0;
            width:100px; height:100px; border-radius:50px;
            border:2px solid rgba(166,152,86,.3);
            background:linear-gradient(135deg, #e1dedd 0%, #d4d1ce 100%);
            color:#A69856;
            display:flex; align-items:center; justify-content:center;
            box-shadow:0 4px 16px rgba(225,222,221,.6);
            transition:transform .3s ease, box-shadow .3s ease, border-color .3s ease;
        }
        .n8n-chat-widget .chat-widget-xxl:hover{
            transform:scale(1.05); border-color:#A69856; box-shadow:0 6px 24px rgba(166,152,86,.4);
        }
        .n8n-chat-widget .chat-widget-xxl svg{ width:36px; height:36px; fill:currentColor; }

        .n8n-chat-widget .savoir-pill{
            pointer-events:auto; position:absolute;
            right:112px; /* 100 + 12 gap */
            bottom:26px; /* optically centered to circle */
            background:#fff; color:#333; padding:14px 18px;
            border-radius:18px; border-bottom-right-radius:4px;
            box-shadow:0 2px 12px rgba(0,0,0,.15);
            font-size:15px; font-weight:600; line-height:1.3;
            max-width:240px; border:1px solid rgba(0,0,0,.1);
            opacity:1; transition:opacity .2s ease;
        }
        .n8n-chat-widget .savoir-pill::after{
            content:''; position:absolute; top:50%; right:-7px; transform:translateY(-50%);
            border-top:8px solid transparent; border-bottom:8px solid transparent; border-left:8px solid #fff;
        }
        .n8n-chat-widget .savoir-pill::before{
            content:''; position:absolute; top:50%; right:-8px; transform:translateY(-50%);
            border-top:9px solid transparent; border-bottom:9px solid transparent; border-left:9px solid rgba(0,0,0,.1);
            z-index:-1;
        }
    `;

    // Load Geist font
    const fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://cdn.jsdelivr.net/npm/geist@1.0.0/dist/fonts/geist-sans/style.css';
    document.head.appendChild(fontLink);

    // Inject styles
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    // ---------- DEFAULT CONFIG ----------
    const defaultConfig = {
        webhook: { url: '', route: '' },
        branding: {
            logo: '', name: '', welcomeText: '', responseTimeText: '',
            poweredBy: { text: 'Powered by intergreat.ai', link: 'https://www.intergreat.ai/' }
        },
        style: { primaryColor: '', secondaryColor: '', position: 'right', backgroundColor: '#ffffff', fontColor: '#333333' },
        fields: { showFirstName: true, showLastName: true, showEmail: true },
        ux: { typingDelay: 1000, messageDelay: 800, typingDuration: 1500, enableMessageSplitting: true, maxMessageLength: 200 },
        launcher: defaultLauncher
    };

    // Merge user config with defaults
    const cfg = window.ChatWidgetConfig ? {
        webhook: { ...defaultConfig.webhook, ...(window.ChatWidgetConfig.webhook || {}) },
        branding: { ...defaultConfig.branding, ...(window.ChatWidgetConfig.branding || {}) },
        style: { ...defaultConfig.style, ...(window.ChatWidgetConfig.style || {}) },
        fields: { ...defaultConfig.fields, ...(window.ChatWidgetConfig.fields || {}) },
        ux: { ...defaultConfig.ux, ...(window.ChatWidgetConfig.ux || {}) },
        siteInfo: { ...(window.ChatWidgetConfig.siteInfo || {}) },
        userInfo: { ...(window.ChatWidgetConfig.userInfo || {}) },
        launcher: { ...defaultLauncher, ...(window.ChatWidgetConfig.launcher || {}) }
    } : defaultConfig;

    // Prevent multiple initializations
    if (window.N8NChatWidgetInitialized) return;
    window.N8NChatWidgetInitialized = true;

    let currentSessionId = '';
    let isTyping = false;

    // Create widget container
    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'n8n-chat-widget';
    widgetContainer.style.setProperty('--n8n-chat-primary-color', cfg.style.primaryColor);
    widgetContainer.style.setProperty('--n8n-chat-secondary-color', cfg.style.secondaryColor);
    widgetContainer.style.setProperty('--n8n-chat-background-color', cfg.style.backgroundColor);
    widgetContainer.style.setProperty('--n8n-chat-font-color', cfg.style.fontColor);

    const chatContainer = document.createElement('div');
    chatContainer.className = `chat-container${cfg.style.position === 'left' ? ' position-left' : ''}`;

    // Build form fields based on configuration
    let formFields = '';
    if (cfg.fields && cfg.fields.showFirstName !== false) formFields += '<input id="user-first-name" class="chat-text-input" placeholder="First Name" />';
    if (cfg.fields && cfg.fields.showLastName !== false)  formFields += '<input id="user-last-name"  class="chat-text-input" placeholder="Last Name" />';
    if (cfg.fields && cfg.fields.showEmail !== false)     formFields += '<input id="user-email" type="email" class="chat-text-input" placeholder="Email" />';

    const newConversationHTML = `
        <div class="brand-header">
            <img src="${cfg.branding.logo}" alt="${cfg.branding.name}">
            <span>${cfg.branding.name}</span>
            <button class="close-button">×</button>
        </div>
        <div class="new-conversation">
            <h2 class="welcome-text">${cfg.branding.welcomeText}</h2>
            ${formFields}
            <button class="new-chat-btn" id="start-chat-btn">
                <svg class="message-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.2L4 17.2V4h16v12z"/>
                </svg>
                Let's Chat
            </button>
            <p class="response-text">${cfg.branding.responseTimeText}</p>
        </div>
    `;

    const chatInterfaceHTML = `
        <div class="chat-interface">
            <div class="brand-header">
                <img src="${cfg.branding.logo}" alt="${cfg.branding.name}">
                <span>${cfg.branding.name}</span>
                <button class="close-button">×</button>
            </div>
            <div class="chat-messages"></div>
            <div class="chat-input">
                <textarea placeholder="Type your message here..." rows="1"></textarea>
                <button type="submit">Send</button>
            </div>
            <div class="chat-footer">
                <a href="${cfg.branding.poweredBy.link}" target="_blank">${cfg.branding.poweredBy.text}</a>
            </div>
        </div>
    `;
    chatContainer.innerHTML = newConversationHTML + chatInterfaceHTML;

    // Default small launcher (kept for backward compatibility)
    const toggleButton = document.createElement('button');
    toggleButton.className = `chat-toggle${cfg.style.position === 'left' ? ' position-left' : ''}`;
    toggleButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M12 2C6.477 2 2 6.477 2 12c0 1.821.487 3.53 1.338 5L2.5 21.5l4.5-.838A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.476 0-2.886-.313-4.156-.878l-3.156.586.586-3.156A7.962 7.962 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z"/>
        </svg>`;

    widgetContainer.appendChild(chatContainer);
    widgetContainer.appendChild(toggleButton);
    document.body.appendChild(widgetContainer);

    // ---------- NEW: XXL LAUNCHER (inside widget) ----------
    let savoirRoot = null, savoirPill = null, savoirBtn = null;
    if (cfg.launcher.enabled && cfg.launcher.variant === 'xxl-clean') {
        savoirRoot = document.createElement('div');
        savoirRoot.className = 'savoir-fixed' + (cfg.style.position === 'left' || cfg.launcher.corner === 'left' ? ' left' : '');
        savoirRoot.setAttribute('data-state', 'closed');

        // allow custom size via config
        const size = Math.max(70, Number(cfg.launcher.size) || 100);
        const css = document.createElement('style');
        css.textContent = `.n8n-chat-widget .chat-widget-xxl{ width:${size}px; height:${size}px; border-radius:${size/2}px; }
                           .n8n-chat-widget .savoir-pill{ right:${size+12}px; }`;
        document.head.appendChild(css);

        if (cfg.launcher.pill !== false) {
            savoirPill = document.createElement('div');
            savoirPill.className = 'savoir-pill';
            savoirRoot.appendChild(savoirPill);
        }

        savoirBtn = document.createElement('button');
        savoirBtn.className = 'chat-widget-xxl';
        savoirBtn.setAttribute('aria-label', 'Open chat');
        savoirBtn.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2C6.477 2 2 6.477 2 12c0 1.821.487 3.53 1.338 5L2.5 21.5l4.5-.838A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"/>
        </svg>`;
        savoirRoot.appendChild(savoirBtn);

        widgetContainer.appendChild(savoirRoot);
        // Hide the default small toggle when XXL is enabled
        toggleButton.style.display = 'none';
    }

    // Grab core DOM
    startChatBtn = chatContainer.querySelector('#start-chat-btn');
    const chatInterface = chatContainer.querySelector('.chat-interface');
    const messagesContainer = chatContainer.querySelector('.chat-messages');
    const textarea = chatContainer.querySelector('textarea');
    const sendButton = chatContainer.querySelector('button[type="submit"]');

    // ---------- PUBLIC API ----------
    function openChat() {
        chatContainer.classList.add('open');
        if (savoirRoot) savoirRoot.setAttribute('data-state', 'open');
        setTimeout(() => textarea && textarea.focus(), 300);
        window.dispatchEvent(new CustomEvent('ChatWidget:open'));
    }
    function closeChat() {
        chatContainer.classList.remove('open');
        if (savoirRoot) savoirRoot.setAttribute('data-state', 'closed');
        window.dispatchEvent(new CustomEvent('ChatWidget:close'));
    }
    function toggleChat() {
        if (chatContainer.classList.contains('open')) closeChat(); else openChat();
    }
    window.ChatWidget = Object.assign(window.ChatWidget || {}, {
        open: openChat, close: closeChat, toggle: toggleChat,
        state: () => (chatContainer.classList.contains('open') ? 'open' : 'closed')
    });

    // ---------- PHRASE LOOP (XXL pill) ----------
    if (savoirPill) {
        const phrases = Array.isArray(cfg.launcher.phrases) && cfg.launcher.phrases.length
            ? cfg.launcher.phrases : ['Hello, I’m Savoir', 'I’m here to help'];
        let idx = 0;
        savoirPill.textContent = phrases[0];
        setInterval(() => {
            savoirPill.style.opacity = '0';
            setTimeout(() => {
                idx = (idx + 1) % phrases.length;
                savoirPill.textContent = phrases[idx];
                savoirPill.style.opacity = '1';
            }, 160);
        }, 3500);
    }
    if (savoirBtn)  savoirBtn.addEventListener('click', openChat);
    if (savoirPill) savoirPill.addEventListener('click', openChat);

    // ---------- EXISTING TYPING / MESSAGE LOGIC (unchanged) ----------
    function showTypingIndicator() {
        if (isTyping) return;
        isTyping = true;
        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator';
        typingDiv.innerHTML = `<div class="typing-dots"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div>`;
        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        textarea.disabled = true; sendButton.disabled = true;
        return typingDiv;
    }
    function hideTypingIndicator(el) {
        if (el && el.parentNode) el.remove();
        isTyping = false; textarea.disabled = false; sendButton.disabled = false; textarea.focus();
    }
    function splitMessage(text, maxLength = cfg.ux.maxMessageLength) {
        if (!cfg.ux.enableMessageSplitting || text.length <= maxLength) return [text];
        const sentences = text.split(/(?<=[.!?])\s+/); const chunks = []; let current = '';
        for (const s of sentences) {
            if (current.length + s.length <= maxLength) current += (current ? ' ' : '') + s;
            else {
                if (current) { chunks.push(current); current = s; }
                else {
                    const words = s.split(' '); let wc = '';
                    for (const w of words) {
                        if (wc.length + w.length <= maxLength) wc += (wc ? ' ' : '') + w;
                        else { if (wc) chunks.push(wc); wc = w; }
                    }
                    if (wc) current = wc;
                }
            }
        }
        if (current) chunks.push(current);
        return chunks;
    }
    function linkifyText(text) {
        const urlRegex = /(https?:\/\/[^\s<>"{}|\\^`[\]]+|www\.[^\s<>"{}|\\^`[\]]+)/gi;
        return text.replace(urlRegex, (url) => {
            let href = url; if (url.startsWith('www.')) href = 'https://' + url;
            let display = url.replace(/^https?:\/\//,'');
            return `<a href="${href}" target="_blank" rel="noopener noreferrer">${display}</a>`;
        });
    }
    async function displayBotMessage(message, options = null, delay = 0) {
        if (delay > 0) await new Promise(r => setTimeout(r, delay));
        const typingElement = showTypingIndicator();
        await new Promise(r => setTimeout(r, cfg.ux.typingDuration));
        hideTypingIndicator(typingElement);

        const chunks = splitMessage(message);
        for (let i = 0; i < chunks.length; i++) {
            if (i > 0) await new Promise(r => setTimeout(r, cfg.ux.messageDelay));
            const botMessageDiv = document.createElement('div');
            botMessageDiv.className = 'chat-message bot';
            botMessageDiv.innerHTML = linkifyText(chunks[i]);
            messagesContainer.appendChild(botMessageDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
        if (options && Array.isArray(options)) {
            const wrap = document.createElement('div'); wrap.className = 'message-buttons';
            options.forEach(opt => {
                const b = document.createElement('button'); b.textContent = opt.label;
                b.onclick = () => {
                    if (wrap.querySelector('button.selected')) return;
                    b.classList.add('selected'); b.textContent = 'Selected ✓';
                    wrap.querySelectorAll('button').forEach(x => x.disabled = true);
                    setTimeout(() => sendMessage(opt.value), 1500);
                };
                wrap.appendChild(b);
            });
            const lastBot = messagesContainer.querySelector('.chat-message.bot:last-child');
            if (lastBot) lastBot.appendChild(wrap); else messagesContainer.appendChild(wrap);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }
    function generateUUID(){ return crypto.randomUUID(); }

    async function startNewConversation() {
        currentSessionId = generateUUID();
        const metadata = { source: (cfg && cfg.siteInfo && cfg.siteInfo.source) || 'unspecified' };
        if (cfg.userInfo.email) { metadata.userId = cfg.userInfo.email; metadata.email = cfg.userInfo.email; }
        if (cfg.userInfo.firstName) metadata.firstName = cfg.userInfo.firstName;
        if (cfg.userInfo.lastName)  metadata.lastName  = cfg.userInfo.lastName;
        if (cfg.userInfo.firstName && cfg.userInfo.lastName) metadata.Name = `${cfg.userInfo.firstName} ${cfg.userInfo.lastName}`;

        const payload = { action:"sendMessage", sessionId: currentSessionId, route: cfg.webhook.route, chatInput: "start", metadata };

        chatContainer.querySelector('.brand-header').style.display = 'none';
        chatContainer.querySelector('.new-conversation').style.display = 'none';
        chatInterface.classList.add('active');

        let typingElement;
        if (cfg.ux.typingDelay > 0) setTimeout(() => typingElement = showTypingIndicator(), cfg.ux.typingDelay);
        else typingElement = showTypingIndicator();

        try {
            const res = await fetch(cfg.webhook.url, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });
            const data = await res.json(); const msg = Array.isArray(data) ? data[0] : data;
            hideTypingIndicator(typingElement);
            await new Promise(r => setTimeout(r, 200));
            await displayBotMessage(msg.output || '', msg.options, 0);
        } catch (err) {
            console.error('Error:', err); hideTypingIndicator(typingElement);
            const e = document.createElement('div'); e.className='chat-message bot';
            e.textContent='Sorry, I’m not able to answer that question. Can you please give us a call on (323) 310-4700 so we can chat through it.';
            e.style.color='#e74c3c'; messagesContainer.appendChild(e); messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }

    async function sendMessage(message) {
        const metadata = { source: (cfg && cfg.siteInfo && cfg.siteInfo.source) || 'unspecified' };
        if (cfg.userInfo.email) { metadata.userId = cfg.userInfo.email; metadata.email = cfg.userInfo.email; }
        if (cfg.userInfo.firstName) metadata.firstName = cfg.userInfo.firstName;
        if (cfg.userInfo.lastName)  metadata.lastName  = cfg.userInfo.lastName;
        if (cfg.userInfo.firstName && cfg.userInfo.lastName) metadata.name = `${cfg.userInfo.firstName} ${cfg.userInfo.lastName}`;

        const payload = { action:"sendMessage", sessionId: currentSessionId, route: cfg.webhook.route, chatInput: message, metadata };

        const userDiv = document.createElement('div'); userDiv.className='chat-message user'; userDiv.textContent = message;
        messagesContainer.appendChild(userDiv); messagesContainer.scrollTop = messagesContainer.scrollHeight;

        let typingElement;
        if (cfg.ux.typingDelay > 0) setTimeout(() => typingElement = showTypingIndicator(), cfg.ux.typingDelay);
        else typingElement = showTypingIndicator();

        try {
            const res = await fetch(cfg.webhook.url, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });
            const data = await res.json(); const msg = Array.isArray(data) ? data[0] : data;
            hideTypingIndicator(typingElement);
            await new Promise(r => setTimeout(r, 200));
            await displayBotMessage(msg.output || '', msg.options, 0);
        } catch (err) {
            console.error('Error:', err); hideTypingIndicator(typingElement);
            const e = document.createElement('div'); e.className='chat-message bot';
            e.textContent='Sorry, I’m not able to answer that question. Can you please give us a call on (323) 310-4700 so we can chat through it.';
            e.style.color='#e74c3c'; messagesContainer.appendChild(e); messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }

    // Event handlers
    const startChatBtn = chatContainer.querySelector('#start-chat-btn');
    startChatBtn.addEventListener('click', () => {
        const errBox = chatContainer.querySelector('.chat-error'); if (errBox) errBox.remove();
        const userData = {}; let validationError = false;

        if (cfg.fields && cfg.fields.showFirstName !== false) {
            const el = chatContainer.querySelector('#user-first-name'); const v = el ? el.value.trim() : '';
            if (!v) validationError = true; else userData.firstName = v;
        }
        if (cfg.fields && cfg.fields.showLastName !== false) {
            const el = chatContainer.querySelector('#user-last-name'); const v = el ? el.value.trim() : '';
            if (!v) validationError = true; else userData.lastName = v;
        }
        if (cfg.fields && cfg.fields.showEmail !== false) {
            const el = chatContainer.querySelector('#user-email'); const v = el ? el.value.trim() : '';
            if (!v || !v.includes('@')) validationError = true; else userData.email = v;
        }

        const hasVisible = (cfg.fields && (cfg.fields.showFirstName !== false || cfg.fields.showLastName !== false || cfg.fields.showEmail !== false));
        if (hasVisible && validationError) {
            const error = document.createElement('div');
            error.className='chat-error'; error.textContent='⚠️ Please fill out all required fields.';
            Object.assign(error.style, { background:'#ffeaea', color:'#a10000', border:'1px solid #e0a1a1', borderRadius:'8px', padding:'10px', margin:'8px 0', fontSize:'14px', textAlign:'center' });
            const form = chatContainer.querySelector('.new-conversation');
            form.insertBefore(error, form.querySelector('p.response-text'));
            setTimeout(() => error.remove(), 6000);
            return;
        }

        cfg.userInfo = userData;
        startNewConversation();
    });

    sendButton = chatContainer.querySelector('button[type="submit"]');
    textarea = chatContainer.querySelector('textarea');

    sendButton.addEventListener('click', () => {
        if (isTyping) return;
        const message = textarea.value.trim();
        if (message) { sendMessage(message); textarea.value = ''; }
    });
    textarea.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (isTyping) return;
            const message = textarea.value.trim();
            if (message) { sendMessage(message); textarea.value = ''; }
        }
    });

    // Small default toggle (hidden when XXL enabled)
    toggleButton.addEventListener('click', () => toggleChat());

    // Close buttons (inside header)
    const closeButtons = chatContainer.querySelectorAll('.close-button');
    closeButtons.forEach(btn => btn.addEventListener('click', closeChat));
})();
