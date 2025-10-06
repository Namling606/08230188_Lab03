// Wait for the entire HTML document to be completely loaded before running any script.
document.addEventListener('DOMContentLoaded', () => {

    // ===================================================================
    // I. Global CSS Injection for Interactivity (DOM Manipulation)
    // ===================================================================
    // This section dynamically creates a <style> element and injects CSS rules 
    // into the document's head. This is used for interactive effects and theme switching.
    const style = document.createElement('style'); // Create a new style element.
    style.textContent = `
        
        /* Theme Toggle Button Styling */
        .theme-toggle {
            position: fixed; /* Fixes button position relative to the viewport. */
            top: 20px;
            right: 20px;
            background: #00bcd4;
            color: #222;
            border: none;
            padding: 10px 15px;
            border-radius: 25px; /* Makes the button round. */
            cursor: pointer;
            font-weight: bold;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
            transition: background 0.3s, transform 0.1s;
            z-index: 1000; /* Ensures the button stays on top of other content. */
        } 

        .theme-toggle:hover {
            background: #0097a7;
            transform: scale(1.05); /* Slightly enlarges the button on hover. */
        }

        /* Dark Mode Styles (Applied when body has .dark-mode class) */
        body.dark-mode {
            background: #121212 !important; /* General dark background. */
            color: #e0e0e0; /* Light text color. */
        }
        body.dark-mode nav {
            background: #1f1f1f;
        }
        body.dark-mode nav ul li a {
            color: #e0e0e0;
        }
        body.dark-mode nav ul li a:hover {
            color: #64ffda; /* Light cyan highlight. */
        }
        body.dark-mode h1, body.dark-mode h2 {
            color: #bb86fc; /* Purple accent for titles. */
        }
        
        /* Interactive Effects */
        .nav-link-active {
            border-bottom: 3px solid #00bcd4; /* Underline for the current page link. */
            padding-bottom: 5px;
        }
        .interactive-card:hover {
            transform: scale(1.03);
            box-shadow: 0 10px 20px rgba(0, 188, 212, 0.4);
            transition: all 0.3s ease-in-out;
            cursor: pointer;
        }
        /* CSS for the hidden detail text (Accordion effect on education page) */
        .edu-item-detail {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.5s ease-out, opacity 0.3s;
            opacity: 0;
            padding-left: 15px;
            border-left: 2px solid #bb86fc;
            margin-top: 5px;
            font-size: 0.9em;
        }
        /* CSS when the detail section is open */
        .edu-item-detail.open {
            max-height: 200px; /* Expands smoothly. */
            opacity: 1;
            padding: 10px 15px 5px 15px;
        }
        .project-item:hover {
            background: rgba(0, 188, 212, 0.1);
            border-radius: 5px;
            transition: background 0.3s;
        }
        .contact-link-hover:hover {
            text-shadow: 0 0 8px #64ffda;
            transform: translateX(5px);
        }
    `;
    document.head.appendChild(style); // Append the style element to the <head> of the document.


    // ===================================================================
    // II. Global Functions (Core JS Logic)
    // ===================================================================

    // Function to check the user's saved theme preference (in localStorage) and apply it.
    // NOTE: This function also updates the text content of the theme toggle button.
    function applyThemeFromStorage() {
        // Retrieve 'theme' from the browser's local storage. Default to 'light'.
        const currentTheme = localStorage.getItem('theme') || 'light'; 
        const body = document.body;
        const toggleButton = document.querySelector('.theme-toggle');

        // Conditional logic (if/else) to apply the correct class to the body.
        if (currentTheme === 'dark') {
            body.classList.add('dark-mode'); // Add dark-mode class for dark styling.
            // Update button text to encourage switching back to light mode.
            if (toggleButton) {
                 // Use a sun emoji to indicate the destination (light mode).
                toggleButton.textContent = '☀️ Light Mode'; 
            }
        } else {
            body.classList.remove('dark-mode'); // Remove dark-mode class for light styling.
            // Update button text to encourage switching to dark mode.
            if (toggleButton) {
                 // Use a moon emoji to indicate the destination (dark mode).
                toggleButton.textContent = '🌙 Dark Mode'; 
            }
        }
    }

    // Function to toggle between Dark and Light mode.
    function toggleTheme() {
        // Toggle the 'dark-mode' class on the body element. Returns true if the class is now present.
        const isDarkMode = document.body.classList.toggle('dark-mode'); 
        
        // Save the new theme state to local storage.
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light'); 

        // Call applyThemeFromStorage again to immediately update the button text based on the new state.
        applyThemeFromStorage();
    }

    // Function to create, populate, and append a dynamic footer to the page.
    function createAndAppendFooter() {
        // DOM Manipulation: Create a new HTML element (footer).
        const footer = document.createElement('footer'); 
        footer.classList.add('footer-dynamic'); // Add a class for specific styling.
        
        // Apply inline styles to the footer element.
        footer.style.cssText = `
            text-align: center;
            padding: 15px;
            background: rgba(0, 0, 0, 0.3);
            font-size: 0.9em;
            margin-top: 30px;
        `;
        
        // Get the current year using the Date object.
        const currentYear = new Date().getFullYear();
        // Get the last modification date of the document.
        const lastModified = document.lastModified;

        // Use a template literal to set the footer's HTML content.
        footer.innerHTML = `
            &copy; ${currentYear} Sangay Namling Yoezer. All rights reserved. | 
            <span id="last-updated">Last Updated: ${lastModified}</span>
        `;
        
        // DOM Manipulation: Attach the new footer element to the end of the body.
        document.body.appendChild(footer); 
    }

    // Function to visually highlight the navigation link corresponding to the current page.
    function highlightActiveNav() {
        // Get all anchor (<a>) tags inside the navigation list.
        const navLinks = document.querySelectorAll('nav ul li a'); 
        // Get the current file name from the URL (e.g., 'index.html'). Default to 'index.html'.
        const currentPath = window.location.pathname.split('/').pop() || 'index.html'; 

        // Loop through each navigation link using a basic for...of loop.
        for (const link of navLinks) {
            // Get the 'href' attribute of the link.
            const linkPath = link.getAttribute('href'); 
            
            // Check if the link's href matches the current file path.
            if (linkPath === currentPath) {
                link.classList.add('nav-link-active'); // Add a class to highlight the link.
            }
        }
    }


    // ===================================================================
    // III. Global Initialization & Event Handling
    // ===================================================================
    
    // 1. Inject and set up Theme Toggle Button
    const toggleButton = document.createElement('button'); // Create the button element.
    toggleButton.classList.add('theme-toggle'); // Apply CSS class for styling.
    // NOTE: Initial text is set by applyThemeFromStorage() below.
    document.body.appendChild(toggleButton); // Add the button to the body.
    
    // 2. Initialize Theme and set button text: Apply the stored theme setting immediately.
    applyThemeFromStorage();

    // 3. Inject Footer: Add the dynamic footer to the page.
    createAndAppendFooter();

    // 4. Highlight Navigation: Set the active state on the current page's link.
    highlightActiveNav();

    // 5. Add a click event listener to the button.
    toggleButton.addEventListener('click', toggleTheme); 


    // ===================================================================
    // IV. Page-Specific Enhancements (Conditional Logic)
    // ===================================================================
    // Get the body's class list to determine which page we are on.
    const pageClass = document.body.className;

    // --- A. index.html (About Me) Logic ---
    if (pageClass.includes('about')) {
        
        // Data Structure: A simple array of strings for fun facts.
        const funFacts = [
            "I once spent an entire weekend trying to debug a missing semicolon.",
            "My favorite Bhutanese dish is Ema Datshi (chili and cheese stew).",
            "I use photography and sketching to balance out my screen time.",
            "I speak three languages: Dzongkha, Nepali, and English.",
            "I'm training to be a teacher, so debugging code and explaining concepts are two sides of the same coin!"
        ];

        // 1. Profile Picture Hover Effect (Interactivity)
        const profilePic = document.querySelector('.profile-pic img');
        if (profilePic) {
            // Set initial style for smooth CSS transitions.
            profilePic.style.transition = 'transform 0.3s, filter 0.3s';
            
            // Event Handling: Listen for mouse entering the image area.
            profilePic.addEventListener('mouseover', () => {
                profilePic.style.transform = 'scale(1.05)'; // Scale up slightly.
                profilePic.style.filter = 'drop-shadow(0 0 10px #00bcd4)'; // Add a glow effect.
            });

            // Event Handling: Listen for mouse leaving the image area.
            profilePic.addEventListener('mouseout', () => {
                profilePic.style.transform = 'scale(1)'; // Reset the scale.
                profilePic.style.filter = 'none'; // Remove the glow effect.
            });
        }
        
        // 2. Inject and Handle Fun Fact Button (Interactivity)
        const aboutText = document.querySelector('.about-text');
        if (aboutText) {
            // Create the button element for displaying facts.
            const factButton = document.createElement('button');
            factButton.textContent = 'Reveal a Fun Fact!';
            
            // Apply inline styles to the button.
            factButton.style.cssText = `
                background: #bb86fc;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 5px;
                cursor: pointer;
                margin-top: 20px;
                transition: background 0.3s;
            `;
            
            // Add hover effects for the button.
            factButton.addEventListener('mouseover', () => factButton.style.background = '#9c66e2');
            factButton.addEventListener('mouseout', () => factButton.style.background = '#bb86fc');
            
            // Create the paragraph element where the fact will be displayed.
            const factDisplay = document.createElement('p');
            factDisplay.id = 'fun-fact-display';
            
            // Apply inline styles to the fact display area.
            factDisplay.style.cssText = `
                margin-top: 15px;
                font-style: italic;
                color: #64ffda;
                min-height: 20px; /* Reserve space so layout doesn't jump. */
            `;

            // Append the button and display element to the 'about-text' container.
            aboutText.appendChild(factButton);
            aboutText.appendChild(factDisplay);

            // Event Handling: When the button is clicked.
            factButton.addEventListener('click', function() {
                // Generate a random index number based on the length of the funFacts array.
                const randomIndex = Math.floor(Math.random() * funFacts.length);
                // Set the text content of the display area to a random fact.
                factDisplay.textContent = funFacts[randomIndex];
            });
        }
    }


    // --- B. education.html Logic (Accordion Effect) ---
    else if (pageClass.includes('education')) {
        // Get all educational item containers.
        const eduItems = document.querySelectorAll('.edu-item');
        
        // Loop through each education item using forEach.
        eduItems.forEach((item, index) => {
            item.classList.add('interactive-card'); // Add class for hover effect.

            // Data Structure: Array of detailed texts to inject.
            const detailText = [
                "Focus on foundation and core subjects, building basic academic skills.",
                "Explored foundational concepts in economics, preparing for higher studies in arts and commerce streams.",
                "Developed critical thinking skills in Arts, complemented by quantitative analysis from Mathematics.",
                "Current focus includes web development, database management, and pedagogical technology integration."
            ];
            
            // Create the hidden paragraph for details.
            const detailParagraph = document.createElement('p');
            detailParagraph.classList.add('edu-item-detail');
            // Assign the corresponding detail text based on the index.
            detailParagraph.textContent = detailText[index]; 
            // Add the paragraph to the current education item.
            item.appendChild(detailParagraph); 

            // Event Handling: Set up the click to toggle the detail section (Accordion).
            item.addEventListener('click', () => {
                // Toggle the 'open' class on the detail paragraph to show/hide it using CSS transitions.
                detailParagraph.classList.toggle('open');
                
                // Loop again to close any OTHER open detail sections.
                eduItems.forEach((otherItem, otherIndex) => {
                    // Control Flow: Check if this is NOT the item we just clicked AND if it's currently open.
                    if (index !== otherIndex) {
                        otherItem.querySelector('.edu-item-detail').classList.remove('open');
                    }
                });
            });
        });
    }


    // --- C. skills.html Logic ---
    else if (pageClass.includes('skills')) {
        // Get all skill item containers.
        const skillItems = document.querySelectorAll('.skill-item');
        
        // Loop through each skill item.
        skillItems.forEach(item => {
            // Add the generic interactive class for scaling/shadow effects.
            item.classList.add('interactive-card');
            
            // Event Handling: Listen for the mouse entering the skill item.
            item.addEventListener('mouseover', () => {
                // DOM Manipulation: Change background on hover for an additional effect.
                item.style.backgroundColor = 'rgba(0, 188, 212, 0.2)';
            });

            // Event Handling: Listen for the mouse leaving the skill item.
            item.addEventListener('mouseout', () => {
                // DOM Manipulation: Reset background to transparent.
                item.style.backgroundColor = 'transparent';
            });
        });
    }


    // --- D. projects.html Logic ---
    else if (pageClass.includes('projects')) {
        // Data Structure: Structured data for project names and status.
        const projectData = [
            { name: "Personal Portfolio Website", status: "Completed (Ongoing Enhancement)" },
            { name: "Oral History Projects", status: "Completed (Archived)" },
            { name: "Webpage UI Design", status: "In Progress (Design Phase)" },
            { name: "Short Film Project", status: "Completed (Post-production)" },
        ];
        
        // Get all list items in the project list.
        const projectListItems = document.querySelectorAll('.project-list li');

        // Loop through each project list item.
        projectListItems.forEach((li, index) => {
            li.classList.add('project-item'); // Add hover class for basic background change.

            // Event Handling: Mouseover to display the project status.
            li.addEventListener('mouseover', () => {
                const status = projectData[index].status;
                // Update the inner HTML to include the status in bold.
                li.innerHTML = `${projectData[index].name} <strong>(${status})</strong>`; 
                li.style.color = '#64ffda'; // Change text color on hover.
            });

            // Event Handling: Mouseout to reset the text and color.
            li.addEventListener('mouseout', () => {
                // Reset text content back to just the name.
                li.textContent = projectData[index].name; 
                // Reset color to inherit the body's default color.
                li.style.color = ''; 
            });
            
            // Event Handling: Click action for feedback.
            li.addEventListener('click', () => {
                const msg = `You clicked: ${projectData[index].name}. Status: ${projectData[index].status}`;
                console.log(msg); // Log the action to the console (as an alternative to alert()).
                
                // Create a temporary message element.
                const tempMsg = document.createElement('span');
                tempMsg.textContent = ' (Interaction noted!)';
                // Apply inline styles for visibility.
                tempMsg.style.cssText = 'color: #bb86fc; margin-left: 10px; font-size: 0.9em;';
                li.appendChild(tempMsg);
                
                // Use setTimeout to remove the message after 1 second (1000 milliseconds).
                setTimeout(() => tempMsg.remove(), 1000);
            });
        });
    }

    
    // --- E. contact.html Logic ---
    else if (pageClass.includes('contact')) {
        // Get all interactive links in the contact section.
        const contactLinks = document.querySelectorAll('.contact-info a');

        // 1. Contact Link Hover Effect (Initial setup)
        contactLinks.forEach(link => {
            link.classList.add('contact-link-hover'); // Apply CSS class for movement/shadow effect.
            link.style.transition = 'all 0.3s ease-out';
        });

        // 2. Copy Email Feature (Utility)
        const emailLink = document.querySelector('a[href^="mailto:"]');
        if (emailLink) {
            // Get the raw email address by replacing 'mailto:' from the href.
            const email = emailLink.getAttribute('href').replace('mailto:', '');

            // Create the copy button element.
            const copyButton = document.createElement('button');
            copyButton.textContent = '📋 Copy Email';
            
            // Apply inline styles to the copy button.
            copyButton.style.cssText = `
                background: #00bcd4;
                color: #222;
                border: none;
                padding: 10px 20px;
                border-radius: 5px;
                cursor: pointer;
                margin-top: 20px;
                transition: background 0.3s, transform 0.1s;
                font-weight: bold;
            `;
            // Add hover effects for the button.
            copyButton.addEventListener('mouseover', () => copyButton.style.background = '#0097a7');
            copyButton.addEventListener('mouseout', () => copyButton.style.background = '#00bcd4');

            // Insert the button right after the email link in the HTML structure.
            emailLink.parentNode.insertBefore(copyButton, emailLink.nextSibling);

            // Event Handling: Logic when the copy button is clicked.
            copyButton.addEventListener('click', function() {
                // Create a temporary, invisible <textarea> element to hold the text.
                const tempInput = document.createElement('textarea');
                tempInput.value = email;
                document.body.appendChild(tempInput); // Must be added to the DOM to work.
                
                // Select and copy the text.
                tempInput.select();
                document.execCommand('copy'); // Use execCommand for better compatibility in iFrames.
                
                // Remove the temporary element immediately.
                document.body.removeChild(tempInput); 

                // Store the original text for resetting the button label.
                const originalText = copyButton.textContent;
                
                // DOM Manipulation: Provide visual feedback to the user.
                copyButton.textContent = '✅ Copied!';
                copyButton.style.background = '#64ffda';
                copyButton.style.color = '#121212';
                
                // Use setTimeout to reset the button text and style after 1.5 seconds.
                setTimeout(() => {
                    copyButton.textContent = originalText;
                    copyButton.style.background = '#00bcd4';
                    copyButton.style.color = '#222';
                }, 1500);
            });
        }
    }
    
});
