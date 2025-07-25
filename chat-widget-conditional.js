// Chat Widget Script with Conditional Fields
(function() {
    // Create and inject styles
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

        .n8n-chat-widget .chat-container.position-left {
            right: auto;
            left: 20px;
        }

        .n8n-chat-widget .chat-container.open {
            display: flex;
            flex-direction: column;
        }

        .n8n-chat-widget .brand-header {
            padding: 16px;
            display: flex;
            align-items: center;
            gap: 12px;
            border-bottom: 1px solid rgba(133, 79, 255, 0.1);
            position: relative;
        }

        .n8n-chat-widget .close-button {
            position: absolute;
            right: 16px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            color: var(--chat--color-font);
            cursor: pointer;
            padding: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: color 0.2s;
            font-size: 20px;
            opacity: 0.6;
        }

        .n8n-chat-widget .close-button:hover {
            opacity: 1;
        }

        .n8n-chat-widget .brand-header img {
            width: 32px;
            height: 32px;
        }

        .n8n-chat-widget .brand-header span {
            font-size: 18px;
            font-weight: 500;
            color: var(--chat--color-font);
        }

        .n8n-chat-widget .new-conversation {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 20px;
            text-align: center;
            width: 100%;
            max-width: 300px;
        }

        .n8n-chat-widget .welcome-text {
            font-size: 24px;
            font-weight: 600;
            color: var(--chat--color-font);
            margin-bottom: 24px;
            line-height: 1.3;
        }

        .n8n-chat-widget .new-chat-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            width: 100%;
            padding: 16px 24px;
            background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
            transition: transform 0.3s;
            font-weight: 500;
            font-family: inherit;
            margin-bottom: 12px;
        }

        .n8n-chat-widget .new-chat-btn:hover {
            transform: scale(1.02);
        }

        .n8n-chat-widget .message-icon {
            width: 20px;
            height: 20px;
        }

        .n8n-chat-widget .response-text {
            font-size: 14px;
            color: var(--chat--color-font);
            opacity: 0.7;
            margin: 0;
        }

        .n8n-chat-widget .chat-interface {
            display: none;
            flex-direction: column;
            height: 100%;
        }

        .n8n-chat-widget .chat-interface.active {
            display: flex;
        }

        .n8n-chat-widget .chat-messages {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
            background: var(--chat--color-background);
            display: flex;
            flex-direction: column;
        }

        .n8n-chat-widget .chat-message {
            padding: 12px 16px;
            margin: 8px 0;
            border-radius: 12px;
            max-width: 80%;
            word-wrap: break-word;
            font-size: 14px;
            line-height: 1.5;
        }

        .n8n-chat-widget .chat-message.user {
            background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
            color: white;
            align-self: flex-end;
            box-shadow: 0 4px 12px rgba(133, 79, 255, 0.2);
            border: none;
        }

        .n8n-chat-widget .chat-message.bot {
            background: var(--chat--color-background);
            border: 1px solid rgba(133, 79, 255, 0.2);
            color: var(--chat--color-font);
            align-self: flex-start;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .n8n-chat-widget .chat-input {
            padding: 16px;
            background: var(--chat--color-background);
            border-top: 1px solid rgba(133, 79, 255, 0.1);
            display: flex;
            gap: 8px;
        }

        .n8n-chat-widget .chat-text-input {
            display: block;
            width: 100%;
            box-sizing: border-box;
            padding: 16px 24px;
            border: 1px solid rgba(133, 79, 255, 0.2);
            border-radius: 8px;
            background: var(--chat--color-background);
            color: var(--chat--color-font);
            font-family: inherit;
            font-size: 14px;
            margin-bottom: 8px;
        }

        .n8n-chat-widget .chat-input textarea {
            flex: 1;
            padding: 12px;
            border: 1px solid rgba(133, 79, 255, 0.2);
            border-radius: 8px;
            background: var(--chat--color-background);
            color: var(--chat--color-font);
            resize: none;
            font-family: inherit;
            font-size: 14px;
        }

        .n8n-chat-widget .chat-input textarea::placeholder {
            color: var(--chat--color-font);
            opacity: 0.6;
        }

        .n8n-chat-widget .chat-input button {
            background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
            color: white;
            border: none;
            border-radius: 8px;
            padding: 0 20px;
            cursor: pointer;
            transition: transform 0.2s;
            font-family: inherit;
            font-weight: 500;
        }

        .n8n-chat-widget .chat-input button:hover {
            transform: scale(1.05);
        }

        .n8n-chat-widget .chat-toggle {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 60px;
            height: 60px;
            border-radius: 30px;
            background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
            color: white;
            border: none;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(133, 79, 255, 0.3);
            z-index: 999;
            transition: transform 0.3s;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .n8n-chat-widget .chat-toggle.position-left {
            right: auto;
            left: 20px;
        }

        .n8n-chat-widget .chat-toggle:hover {
            transform: scale(1.05);
        }

        .n8n-chat-widget .chat-toggle svg {
            width: 24px;
            height: 24px;
            fill: currentColor;
        }

        .n8n-chat-widget .chat-footer {
            padding: 8px;
            text-align: center;
            background: var(--chat--color-background);
            border-top: 1px solid rgba(133, 79, 255, 0.1);
        }

        .n8n-chat-widget .chat-footer a {
            color: var(--chat--color-primary);
            text-decoration: none;
            font-size: 12px;
            opacity: 0.8;
            transition: opacity 0.2s;
            font-family: inherit;
        }

        .n8n-chat-widget .chat-footer a:hover {
            opacity: 1;
        }

        /* Hidden field styling */
        .n8n-chat-widget .chat-text-input.hidden {
            display: none;
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

    // Default configuration
    const defaultConfig = {
        webhook: {
            url: '',
            route: ''
        },
        branding: {
            logo: '',
            name: '',
            welcomeText: '',
            responseTimeText: '',
            poweredBy: {
                text: 'Powered by intergreat.ai',
                link: 'https://www.intergreat.ai/'
            }
        },
        style: {
            primaryColor: '',
            secondaryColor: '',
            position: 'right',
            backgroundColor: '#ffffff',
            fontColor: '#333333'
        },
        // NEW: Field visibility configuration
        fields: {
            showFirstName: true,
            showLastName: true,
            showEmail: true
        }
    };

    // Merge user config with defaults
    const config = window.ChatWidgetConfig ? 
        {
            webhook: { ...defaultConfig.webhook, ...(window.ChatWidgetConfig.webhook || {}) },
            branding: { ...defaultConfig.branding, ...(window.ChatWidgetConfig.branding || {}) },
            style: { ...defaultConfig.style, ...(window.ChatWidgetConfig.style || {}) },
            fields: { ...defaultConfig.fields, ...(window.ChatWidgetConfig.fields || {}) },
            siteInfo: { ...(window.ChatWidgetConfig.siteInfo || {}) },
            userInfo: { ...(window.ChatWidgetConfig.userInfo || {}) }
        } : defaultConfig;

    // Prevent multiple initializations
    if (window.N8NChatWidgetInitialized) return;
    window.N8NChatWidgetInitialized = true;

    let currentSessionId = '';

    // Create widget container
    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'n8n-chat-widget';
    
    // Set CSS variables for colors
    widgetContainer.style.setProperty('--n8n-chat-primary-color', config.style.primaryColor);
    widgetContainer.style.setProperty('--n8n-chat-secondary-color', config.style.secondaryColor);
    widgetContainer.style.setProperty('--n8n-chat-background-color', config.style.backgroundColor);
    widgetContainer.style.setProperty('--n8n-chat-font-color', config.style.fontColor);

    const chatContainer = document.createElement('div');
    chatContainer.className = `chat-container${config.style.position === 'left' ? ' position-left' : ''}`;
    
    // Debug logging
    console.log('Chat Widget Config:', config);
    console.log('Fields config:', config.fields);
    
    // Build form fields based on configuration
    let formFields = '';
    if (config.fields && config.fields.showFirstName !== false) {
        formFields += '<input id="user-first-name" class="chat-text-input" placeholder="First Name" />';
    }
    if (config.fields && config.fields.showLastName !== false) {
        formFields += '<input id="user-last-name" class="chat-text-input" placeholder="Last Name" />';
    }
    if (config.fields && config.fields.showEmail !== false) {
        formFields += '<input id="user-email" type="email" class="chat-text-input" placeholder="Email" />';
    }
    
    console.log('Generated form fields:', formFields);

    const newConversationHTML = `
        <div class="brand-header">
            <img src="${config.branding.logo}" alt="${config.branding.name}">
            <span>${config.branding.name}</span>
            <button class="close-button">×</button>
        </div>
        <div class="new-conversation">
            <h2 class="welcome-text">${config.branding.welcomeText}</h2>
            ${formFields}
            <button class="new-chat-btn" id="start-chat-btn">
                <svg class="message-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.2L4 17.2V4h16v12z"/>
                </svg>
                Send us a message
            </button>
            <p class="response-text">${config.branding.responseTimeText}</p>
        </div>
    `;

    const chatInterfaceHTML = `
        <div class="chat-interface">
            <div class="brand-header">
                <img src="${config.branding.logo}" alt="${config.branding.name}">
                <span>${config.branding.name}</span>
                <button class="close-button">×</button>
            </div>
            <div class="chat-messages"></div>
            <div class="chat-input">
                <textarea placeholder="Type your message here..." rows="1"></textarea>
                <button type="submit">Send</button>
            </div>
            <div class="chat-footer">
                <a href="${config.branding.poweredBy.link}" target="_blank">${config.branding.poweredBy.text}</a>
            </div>
        </div>
    `;
    
    chatContainer.innerHTML = newConversationHTML + chatInterfaceHTML;
    
    const toggleButton = document.createElement('button');
    toggleButton.className = `chat-toggle${config.style.position === 'left' ? ' position-left' : ''}`;
    toggleButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M12 2C6.477 2 2 6.477 2 12c0 1.821.487 3.53 1.338 5L2.5 21.5l4.5-.838A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.476 0-2.886-.313-4.156-.878l-3.156.586.586-3.156A7.962 7.962 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z"/>
        </svg>`;
    
    widgetContainer.appendChild(chatContainer);
    widgetContainer.appendChild(toggleButton);
    document.body.appendChild(widgetContainer);

    const startChatBtn = chatContainer.querySelector('#start-chat-btn');
    
    startChatBtn.addEventListener('click', () => {
        const errorContainer = chatContainer.querySelector('.chat-error');
        if (errorContainer) errorContainer.remove();
        
        // Collect only visible field values
        const userData = {};
        let validationError = false;
        
        if (config.fields && config.fields.showFirstName !== false) {
            const firstNameEl = chatContainer.querySelector('#user-first-name');
            const firstName = firstNameEl ? firstNameEl.value.trim() : '';
            if (!firstName) {
                validationError = true;
            } else {
                userData.firstName = firstName;
            }
        }
        
        if (config.fields && config.fields.showLastName !== false) {
            const lastNameEl = chatContainer.querySelector('#user-last-name');
            const lastName = lastNameEl ? lastNameEl.value.trim() : '';
            if (!lastName) {
                validationError = true;
            } else {
                userData.lastName = lastName;
            }
        }
        
        if (config.fields && config.fields.showEmail !== false) {
            const emailEl = chatContainer.querySelector('#user-email');
            const email = emailEl ? emailEl.value.trim() : '';
            if (!email || !email.includes('@')) {
                validationError = true;
            } else {
                userData.email = email;
            }
        }
        
        // If no fields are required (all hidden), proceed directly
        const hasVisibleFields = (config.fields && config.fields.showFirstName !== false) || 
                                (config.fields && config.fields.showLastName !== false) || 
                                (config.fields && config.fields.showEmail !== false);
        
        if (hasVisibleFields && validationError) {
            const error = document.createElement('div');
            error.className = 'chat-error';
            error.textContent = '⚠️ Please fill out all required fields.';
            error.style.background = '#ffeaea';
            error.style.color = '#a10000';
            error.style.border = '1px solid #e0a1a1';
            error.style.borderRadius = '8px';
            error.style.padding = '10px';
            error.style.margin = '8px 0';
            error.style.fontSize = '14px';
            error.style.textAlign = 'center';

            const form = chatContainer.querySelector('.new-conversation');
            form.insertBefore(error, form.querySelector('p.response-text'));
            setTimeout(() => {
                error.remove();
            }, 6000);
            return;
        }
        
        config.userInfo = userData;
        startNewConversation();
    });

    const chatInterface = chatContainer.querySelector('.chat-interface');
    const messagesContainer = chatContainer.querySelector('.chat-messages');
    const textarea = chatContainer.querySelector('textarea');
    const sendButton = chatContainer.querySelector('button[type="submit"]');

    function generateUUID() {
        return crypto.randomUUID();
    }

    async function startNewConversation() {
        currentSessionId = generateUUID();
        console.log("CONFIG DEBUG:", config);

        // Build metadata with only available user info
        const metadata = {
            source: (config && config.siteInfo && config.siteInfo.source) || 'unspecified'
        };
        
        // Add user info only if it exists
        if (config.userInfo.email) {
            metadata.userId = config.userInfo.email;
            metadata.email = config.userInfo.email;
        }
        if (config.userInfo.firstName) {
            metadata.firstName = config.userInfo.firstName;
        }
        if (config.userInfo.lastName) {
            metadata.lastName = config.userInfo.lastName;
        }
        if (config.userInfo.firstName && config.userInfo.lastName) {
            metadata.Name = `${config.userInfo.firstName} ${config.userInfo.lastName}`;
        }

        const messageData = {
            action: "sendMessage",
            sessionId: currentSessionId,
            route: config.webhook.route,
            chatInput: "start",
            metadata: metadata
        };

        try {
            const response = await fetch(config.webhook.url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(messageData)
            });

            const data = await response.json();
            const msg = Array.isArray(data) ? data[0] : data;

            chatContainer.querySelector('.brand-header').style.display = 'none';
            chatContainer.querySelector('.new-conversation').style.display = 'none';
            chatInterface.classList.add('active');

            const botMessageDiv = document.createElement('div');
            botMessageDiv.className = 'chat-message bot';
            botMessageDiv.textContent = msg.output || '';
            messagesContainer.appendChild(botMessageDiv);

            if (msg.options && Array.isArray(msg.options)) {
                const buttonWrapper = document.createElement('div');
                buttonWrapper.style.display = 'flex';
                buttonWrapper.style.flexWrap = 'wrap';
                buttonWrapper.style.gap = '8px';
                buttonWrapper.style.marginTop = '8px';

                msg.options.forEach(opt => {
                    const btn = document.createElement('button');
                    btn.textContent = opt.label;
                    btn.style.padding = '8px 12px';
                    btn.style.borderRadius = '6px';
                    btn.style.border = '1px solid #ccc';
                    btn.style.background = '#f7f7f7';
                    btn.style.cursor = 'pointer';
                    btn.onclick = () => sendMessage(opt.value);
                    buttonWrapper.appendChild(btn);
                });

                messagesContainer.appendChild(buttonWrapper);
            }

            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        } catch (error) {
            console.error('Error:', error);
        }
    }

    async function sendMessage(message) {
        console.log("CONFIG DEBUG:", config);
        
        // Build metadata with only available user info
        const metadata = {
            source: (config && config.siteInfo && config.siteInfo.source) || 'unspecified'
        };
        
        // Add user info only if it exists
        if (config.userInfo.email) {
            metadata.userId = config.userInfo.email;
            metadata.email = config.userInfo.email;
        }
        if (config.userInfo.firstName) {
            metadata.firstName = config.userInfo.firstName;
        }
        if (config.userInfo.lastName) {
            metadata.lastName = config.userInfo.lastName;
        }
        if (config.userInfo.firstName && config.userInfo.lastName) {
            metadata.name = `${config.userInfo.firstName} ${config.userInfo.lastName}`;
        }

        const messageData = {
            action: "sendMessage",
            sessionId: currentSessionId,
            route: config.webhook.route,
            chatInput: message,
            metadata: metadata
        };

        // Show user's message
        const userMessageDiv = document.createElement('div');
        userMessageDiv.className = 'chat-message user';
        userMessageDiv.textContent = message;
        messagesContainer.appendChild(userMessageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        try {
            const response = await fetch(config.webhook.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(messageData)
            });

            const data = await response.json();
            const msg = Array.isArray(data) ? data[0] : data;

            // Show bot message
            const botMessageDiv = document.createElement('div');
            botMessageDiv.className = 'chat-message bot';
            botMessageDiv.textContent = msg.output || '';
            messagesContainer.appendChild(botMessageDiv);

            // Add buttons if available
            if (msg.options && Array.isArray(msg.options)) {
                const buttonWrapper = document.createElement('div');
                buttonWrapper.style.display = 'flex';
                buttonWrapper.style.flexWrap = 'wrap';
                buttonWrapper.style.gap = '8px';
                buttonWrapper.style.marginTop = '8px';

                msg.options.forEach(opt => {
                    const btn = document.createElement('button');
                    btn.textContent = opt.label;
                    btn.style.padding = '8px 12px';
                    btn.style.borderRadius = '6px';
                    btn.style.border = '1px solid #ccc';
                    btn.style.background = '#f7f7f7';
                    btn.style.cursor = 'pointer';
                    btn.onclick = () => sendMessage(opt.value);
                    buttonWrapper.appendChild(btn);
                });

                messagesContainer.appendChild(buttonWrapper);
            }

            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        } catch (error) {
            console.error('Error:', error);
        }
    }
    
    sendButton.addEventListener('click', () => {
        const message = textarea.value.trim();
        if (message) {
            sendMessage(message);
            textarea.value = '';
        }
    });
    
    textarea.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            const message = textarea.value.trim();
            if (message) {
                sendMessage(message);
                textarea.value = '';
            }
        }
    });
    
    toggleButton.addEventListener('click', () => {
        chatContainer.classList.toggle('open');
    });

    // Add close button handlers
    const closeButtons = chatContainer.querySelectorAll('.close-button');
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            chatContainer.classList.remove('open');
        });
    });
})();
