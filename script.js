document.addEventListener('DOMContentLoaded', function() {
    // Navigation functionality
    const navLinks = document.querySelectorAll('.nav-link');
    const contentSections = document.querySelectorAll('.content-section');
    const headerSearch = document.getElementById('headerSearch');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            
            showSection(targetId);
            
            // Update active nav item
            document.querySelectorAll('.nav-item').forEach(item => {
                item.classList.remove('active');
            });
            this.parentElement.classList.add('active');
        });
    });
    
    // Header search functionality
    headerSearch.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        
        if (searchTerm === '') {
            // Clear highlights
            document.querySelectorAll('.highlight').forEach(el => {
                el.classList.remove('highlight');
                el.style.backgroundColor = '';
            });
            return;
        }
        
        // Search in all content sections
        const searchableElements = document.querySelectorAll(
            '.cooperative-card h3, .cooperative-card .stat, ' +
            '.officer .name, .officer .position, ' +
            '.committee-card h4, .committee-members p, .committee-members li, ' +
            '.training-list li'
        );
        
        // Remove previous highlights
        document.querySelectorAll('.highlight').forEach(el => {
            el.classList.remove('highlight');
            el.style.backgroundColor = '';
        });
        
        let foundAny = false;
        
        searchableElements.forEach(element => {
            const text = element.textContent.toLowerCase();
            if (text.includes(searchTerm)) {
                highlightText(element, searchTerm);
                foundAny = true;
                
                // Show the section containing this element
                const section = element.closest('.content-section');
                if (section) {
                    section.classList.add('active');
                }
            }
        });
        
        // If searching, hide non-matching cooperative cards
        if (searchTerm !== '') {
            const cooperativeCards = document.querySelectorAll('.cooperative-card');
            cooperativeCards.forEach(card => {
                const cardText = card.textContent.toLowerCase();
                if (!cardText.includes(searchTerm)) {
                    card.style.display = 'none';
                } else {
                    card.style.display = '';
                }
            });
        } else {
            // Show all cards when search is empty
            const cooperativeCards = document.querySelectorAll('.cooperative-card');
            cooperativeCards.forEach(card => {
                card.style.display = '';
            });
        }
    });
    
    function highlightText(element, searchTerm) {
        const text = element.textContent;
        const regex = new RegExp(`(${searchTerm})`, 'gi');
        
        if (element.children.length === 0) {
            // Simple text node
            const span = document.createElement('span');
            span.innerHTML = text.replace(regex, '<span class="highlight">$1</span>');
            element.parentNode.replaceChild(span, element);
        } else {
            // Element with children - search within
            const walker = document.createTreeWalker(
                element,
                NodeFilter.SHOW_TEXT,
                null,
                false
            );
            
            const textNodes = [];
            let node;
            while (node = walker.nextNode()) {
                if (node.textContent.toLowerCase().includes(searchTerm)) {
                    textNodes.push(node);
                }
            }
            
            textNodes.forEach(textNode => {
                const span = document.createElement('span');
                span.innerHTML = textNode.textContent.replace(regex, '<span class="highlight">$1</span>');
                textNode.parentNode.replaceChild(span, textNode);
            });
        }
    }
    
    // Cooperative list functionality
    const createButtons = document.querySelectorAll('.create-btn');
    
    // This section is for cooperative items, which are likely in a list or sidebar
    document.querySelectorAll('.cooperative-item').forEach(item => {
        item.addEventListener('click', function(e) {
            // Only trigger if click is not on the create button
            if (!e.target.closest('.create-btn')) {
                // Remove active class from all items
                cooperativeItems.forEach(coop => {
                    coop.classList.remove('active');
                });
                
                // Add active class to clicked item
                this.classList.add('active');
                
                // Show cooperative details
                const cooperativeName = this.querySelector('.cooperative-name').textContent;
                showCooperativeDetails(cooperativeName);
            }
        });
    });
    
    // Create button functionality
    createButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent triggering the cooperative item click
            const cooperativeName = this.parentElement.querySelector('.cooperative-name').textContent;
            handleCreateAction(cooperativeName);
        });
    });
    
    function showSection(sectionId) {
        contentSections.forEach(section => {
            section.classList.remove('active');
        });
        
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
        }
    }
    
    // Show cooperative details
    window.showCooperativeDetails = function(cooperativeId) {
        console.log('showCooperativeDetails called with:', cooperativeId);
        showSection('cooperative-details');
        
        // Update active nav item
        document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
        
        // Update content based on cooperative ID
        const detailContainer = document.querySelector('.cooperative-detail');
        console.log('Detail container found:', detailContainer);
        
        // Cooperative data database
        const cooperativeData = { // Filtered to only include admin-created cooperative
            'cawayan': {
                name: 'Cawayan II Farmers Multi-Purpose Cooperative',
                businessActivity: 'Lending',
                products: 'None',
                members: '1,619',
                officers: {
                    'Board of Directors': [
                        { position: 'Chairman', name: 'Jose V. Llagas Jr.' },
                        { position: 'Vice-Chairman', name: 'Nide S. Herez' },
                        { position: 'Secretary', name: 'Mahaleel H. Diola' },
                        { position: 'Treasurer', name: 'Rosalie G. Eleazar' }
                    ],
                    'Management Staff': [
                        { position: 'Manager', name: 'Ailyn S. Uybad' },
                        { position: 'Cashier', name: 'Lea S. Revidizo' },
                        { position: 'Bookkeeper', name: 'Jhonna Mai R. Dugan' },
                        { position: 'Account Officer', name: 'Buena P. Lagos' },
                        { position: 'Account Officer', name: 'Elly A. Bonillo' },
                        { position: 'Account Officer', name: 'Gamaliel S. Hilario' },
                        { position: 'Utility', name: 'Erma S. Evangelista' }
                    ]
                },
                training: ['Governance and Management of Cooperatives', 'Fundamental of Cooperatives', 'Risk Management', 'Credit Management', 'Financial Management']
            }
        };

    // Helper to get cooperative ID by name
    function getCooperativeIdByName(name) {
        for (const id in cooperativeData) {
            if (cooperativeData[id].name === name) {
                return id;
            }
        }
        return null;
    }

    // Filter and attach event listeners for cooperative cards
    const cooperativeCards = document.querySelectorAll('.cooperative-card');
    cooperativeCards.forEach(card => {
        const onclickAttr = card.getAttribute('onclick');
        let cooperativeId = null;
        if (onclickAttr) {
            const match = onclickAttr.match(/showCooperativeDetails\('([^']+)'\)/);
            if (match) {
                cooperativeId = match[1];
            }
        }

        if (cooperativeId && !cooperativeData[cooperativeId]) {
            card.remove(); // Remove cards not in our filtered data
        } else if (cooperativeId) {
            // Attach event listener only if the card is valid
            card.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Cooperative card clicked:', cooperativeId);
                showCooperativeDetails(cooperativeId);
            });
        }
    });

    // Filter and attach event listeners for cooperative items (e.g., in a sidebar list)
    const cooperativeItems = document.querySelectorAll('.cooperative-item');
    cooperativeItems.forEach(item => {
        const cooperativeNameElement = item.querySelector('.cooperative-name');
        if (!cooperativeNameElement) {
            item.remove(); // Remove if no name element found
            return;
        }
        const cooperativeName = cooperativeNameElement.textContent;
        const cooperativeId = getCooperativeIdByName(cooperativeName);

        if (!cooperativeId) {
            item.remove(); // Remove items not in our filtered data
        } else {
            item.addEventListener('click', function(e) {
                // Only trigger if click is not on the create button
                if (!e.target.closest('.create-btn')) {
                    // Remove active class from all items
                    document.querySelectorAll('.cooperative-item').forEach(coop => {
                        coop.classList.remove('active');
                    });
                    
                    // Add active class to clicked item
                    this.classList.add('active');
                    
                    // Show cooperative details
                    console.log('Cooperative item clicked:', cooperativeName);
                    showCooperativeDetails(cooperativeId); // Use ID here
                }
            });
        }
        };
        
        // Get cooperative data
        const coop = cooperativeData[cooperativeId];
        
        if (coop) {
            // Generate officers HTML
            let officersHTML = '<div class="officers"><h3>List of Officers</h3>';
            
            for (const [committee, members] of Object.entries(coop.officers)) {
                officersHTML += `
                    <div class="officer-section">
                        <h4>${committee}</h4>
                        <div class="officer-grid">
                `;
                
                members.forEach(member => {
                    officersHTML += `
                        <div class="officer">
                            <span class="position">${member.position}:</span>
                            <span class="name">${member.name}</span>
                        </div>
                    `;
                });
                
                officersHTML += '</div></div>';
            }
            
            officersHTML += '</div>';
            
            // Generate training HTML
            let trainingHTML = `
                <div class="training">
                    <h3>Training Attended</h3>
                    <div class="training-list">
                        <ul>
            `;
            
            coop.training.forEach(training => {
                trainingHTML += `<li>${training}</li>`;
            });
            
            trainingHTML += '</ul></div></div>';
            
            // Set the HTML content
            detailContainer.innerHTML = `
                <h2>${coop.name}</h2>
                
                <div class="overview">
                    <div class="stats-grid">
                        <div class="stat-card">
                            <h3>Business Activity</h3>
                            <p>${coop.businessActivity}</p>
                        </div>
                        <div class="stat-card">
                            <h3>Products</h3>
                            <p>${coop.products}</p>
                        </div>
                        <div class="stat-card">
                            <h3>Number of Members</h3>
                            <p>${coop.members}</p>
                        </div>
                    </div>
                </div>

                ${officersHTML}

                ${trainingHTML}
            `;
        } else {
            // Fallback content for cooperatives not in database
            detailContainer.innerHTML = `
                <h2>Cooperative Details</h2>
                <div class="overview">
                    <div class="stats-grid">
                        <div class="stat-card">
                            <h3>Business Activity</h3>
                            <p>Information not available</p>
                        </div>
                        <div class="stat-card">
                            <h3>Products</h3>
                            <p>Information not available</p>
                        </div>
                        <div class="stat-card">
                            <h3>Number of Members</h3>
                            <p>Information not available</p>
                        </div>
                    </div>
                </div>
                
                <div class="officers">
                    <h3>List of Officers</h3>
                    <p>Officer information not available yet. This cooperative's details are being updated.</p>
                </div>
                
                <div class="training">
                    <h3>Training Attended</h3>
                    <p>Training information not available yet.</p>
                </div>
            `;
        }
    };
    
    window.showSection = showSection;
    
    // Handle create action for cooperatives
    function handleCreateAction(cooperativeName) {
        // Create a simple modal to show create options
        const modal = document.createElement('div');
        modal.className = 'create-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>Create for ${cooperativeName}</h3>
                <div class="create-options">
                    <button class="create-option" data-action="report">
                        <i class="fas fa-file-alt"></i>
                        <span>Create Report</span>
                    </button>
                    <button class="create-option" data-action="member">
                        <i class="fas fa-user-plus"></i>
                        <span>Add Member</span>
                    </button>
                    <button class="create-option" data-action="meeting">
                        <i class="fas fa-calendar"></i>
                        <span>Schedule Meeting</span>
                    </button>
                    <button class="create-option" data-action="document">
                        <i class="fas fa-folder"></i>
                        <span>New Document</span>
                    </button>
                </div>
                <button class="close-modal">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add modal styles
        const modalStyle = document.createElement('style');
        modalStyle.textContent = `
            .create-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 3000;
                animation: fadeIn 0.3s ease;
            }
            
            .modal-content {
                background: white;
                border-radius: 10px;
                padding: 2rem;
                max-width: 500px;
                width: 90%;
                position: relative;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                animation: slideUp 0.3s ease;
            }
            
            .modal-content h3 {
                color: #2c1810;
                margin-bottom: 1.5rem;
                font-size: 1.3rem;
            }
            
            .create-options {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 1rem;
                margin-bottom: 1rem;
            }
            
            .create-option {
                background: #f8f9fa;
                border: 2px solid #e9ecef;
                border-radius: 8px;
                padding: 1.5rem 1rem;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 0.5rem;
                text-align: center;
            }
            
            .create-option:hover {
                background: #8B4513;
                border-color: #8B4513;
                color: white;
                transform: translateY(-2px);
            }
            
            .create-option i {
                font-size: 1.5rem;
                color: #8B4513;
            }
            
            .create-option:hover i {
                color: white;
            }
            
            .create-option span {
                font-size: 0.9rem;
                font-weight: 500;
            }
            
            .close-modal {
                position: absolute;
                top: 1rem;
                right: 1rem;
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: #6c757d;
                transition: color 0.3s ease;
            }
            
            .close-modal:hover {
                color: #dc3545;
            }
            
            @keyframes slideUp {
                from {
                    transform: translateY(50px);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }
            
            @media (max-width: 480px) {
                .create-options {
                    grid-template-columns: 1fr;
                }
            }
        `;
        document.head.appendChild(modalStyle);
        
        // Handle option clicks
        const createOptions = modal.querySelectorAll('.create-option');
        createOptions.forEach(option => {
            option.addEventListener('click', function() {
                const action = this.getAttribute('data-action');
                alert(`Creating ${action} for ${cooperativeName}\n\nThis feature is under development.`);
                document.body.removeChild(modal);
                document.head.removeChild(modalStyle);
            });
        });
        
        // Handle close button
        const closeBtn = modal.querySelector('.close-modal');
        closeBtn.addEventListener('click', function() {
            document.body.removeChild(modal);
            document.head.removeChild(modalStyle);
        });
        
        // Close on background click
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                document.body.removeChild(modal);
                document.head.removeChild(modalStyle);
            }
        });
    }
    
    // Header search functionality (already present, but ensure it works with filtered data)
    const searchToggle = document.getElementById('searchToggle');
    const searchOverlay = document.getElementById('searchOverlay');
    const closeSearch = document.getElementById('closeSearch');
    const searchInput = document.getElementById('searchInput');
    
    searchToggle.addEventListener('click', function() {
        searchOverlay.classList.add('active');
        searchInput.focus();
    });
    
    closeSearch.addEventListener('click', function() {
        searchOverlay.classList.remove('active');
        searchInput.value = '';
    });
    
    searchOverlay.addEventListener('click', function(e) {
        if (e.target === searchOverlay) {
            searchOverlay.classList.remove('active');
            searchInput.value = '';
        }
    });
    
    // Overlay search functionality (already present, but ensure it works with filtered data)
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        
        if (searchTerm === '') {
            // Remove all highlights
            document.querySelectorAll('.highlight').forEach(el => {
                el.classList.remove('highlight');
                el.style.backgroundColor = '';
            });
            return;
        }
        
        // Remove previous highlights
        document.querySelectorAll('.highlight').forEach(el => {
            el.classList.remove('highlight');
            el.style.backgroundColor = '';
        });
        
        // Search in cooperative details
        const searchableElements = document.querySelectorAll(
            '#cooperative-details .name, #cooperative-details .position, ' +
            '#cooperative-details .committee-card h4, #cooperative-details .committee-members p, ' +
            '#cooperative-details .committee-members li, #cooperative-details .training-list li'
        );
        
        let foundAny = false;
        
        searchableElements.forEach(element => {
            const text = element.textContent.toLowerCase();
            if (text.includes(searchTerm)) {
                highlightText(element, searchTerm);
                foundAny = true;
            }
        });
        
        // If searching, show cooperative details section
        if (foundAny && searchTerm !== '') {
            showSection('cooperative-details');
            
            // Scroll to first match
            setTimeout(() => {
                const firstHighlight = document.querySelector('.highlight');
                if (firstHighlight) {
                    firstHighlight.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 100);
        }
    });
    
    function highlightText(element, searchTerm) {
        const text = element.textContent;
        const regex = new RegExp(`(${searchTerm})`, 'gi');
        
        if (element.children.length === 0) {
            // Simple text node
            const span = document.createElement('span');
            span.innerHTML = text.replace(regex, '<span class="highlight">$1</span>');
            element.parentNode.replaceChild(span, element);
        } else {
            // Element with children - search within
            const walker = document.createTreeWalker(
                element,
                NodeFilter.SHOW_TEXT,
                null,
                false
            );
            
            const textNodes = [];
            let node;
            while (node = walker.nextNode()) {
                if (node.textContent.toLowerCase().includes(searchTerm)) {
                    textNodes.push(node);
                }
            }
            
            textNodes.forEach(textNode => {
                const span = document.createElement('span');
                span.innerHTML = textNode.textContent.replace(regex, '<span class="highlight">$1</span>');
                textNode.parentNode.replaceChild(span, textNode);
            });
        }
    }
    
    // Add highlight styles
    const style = document.createElement('style');
    style.textContent = `
        .highlight {
            background-color: #fff3cd !important;
            color: #856404 !important;
            padding: 2px 4px;
            border-radius: 3px;
            animation: pulse 1s ease-in-out;
        }
        
        @keyframes pulse {
            0% { background-color: #fff3cd; }
            50% { background-color: #ffeaa7; }
            100% { background-color: #fff3cd; }
        }
    `;
    document.head.appendChild(style);
    
    // Click-to-copy functionality for officer names
    const officerNames = document.querySelectorAll('.name');
    officerNames.forEach(name => {
        name.style.cursor = 'pointer';
        name.title = 'Click to copy name';
        
        name.addEventListener('click', function(e) {
            e.stopPropagation();
            const textToCopy = this.textContent.trim();
            navigator.clipboard.writeText(textToCopy).then(() => {
                // Show feedback
                const originalText = this.textContent;
                this.textContent = 'Copied!';
                this.style.color = '#28a745';
                
                setTimeout(() => {
                    this.textContent = originalText;
                    this.style.color = '';
                }, 1500);
            }).catch(err => {
                console.error('Failed to copy text: ', err);
            });
        });
    });
    
        
    // Mobile sidebar toggle
    function addMobileMenuToggle() {
        const menuToggle = document.getElementById('mobileMenuToggle');
        const sidebar = document.querySelector('.sidebar');
        const overlay = document.getElementById('mobileMenuOverlay');
        
        console.log('Mobile menu elements:', {
            menuToggle: !!menuToggle,
            sidebar: !!sidebar,
            overlay: !!overlay
        });
        
        if (!menuToggle || !sidebar || !overlay) {
            console.error('Mobile menu elements not found');
            return;
        }
        
        // Toggle menu
        menuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Mobile menu toggle clicked');
            
            sidebar.classList.toggle('active');
            overlay.classList.toggle('active');
            
            console.log('Menu state:', {
                sidebarActive: sidebar.classList.contains('active'),
                overlayActive: overlay.classList.contains('active')
            });
            
            // Change icon based on menu state
            const icon = this.querySelector('i');
            if (sidebar.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
                console.log('Icon changed to times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                console.log('Icon changed to bars');
            }
        });
        
        // Close menu when clicking overlay
        overlay.addEventListener('click', function() {
            console.log('Overlay clicked');
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
            const icon = menuToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
        
        // Close menu when clicking on navigation links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                console.log('Nav link clicked');
                sidebar.classList.remove('active');
                overlay.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });
        
        // Handle window resize
        const mediaQuery = window.matchMedia('(max-width: 768px)');
        function handleMobileChange(e) {
            console.log('Screen size changed:', e.matches ? 'mobile' : 'desktop');
            if (!e.matches) {
                // Close menu on desktop
                sidebar.classList.remove('active');
                overlay.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
        
        mediaQuery.addListener(handleMobileChange);
        handleMobileChange(mediaQuery);
    }
    
    addMobileMenuToggle();
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + K to open search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            searchOverlay.classList.add('active');
            searchInput.focus();
        }
        
        // Escape to close search
        if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
            searchOverlay.classList.remove('active');
            searchInput.value = '';
        }
        
        // Ctrl/Cmd + P to print
        if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
            e.preventDefault();
            window.print();
        }
    });
    
    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Add loading animation
    const sections = document.querySelectorAll('.content-section');
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
});
