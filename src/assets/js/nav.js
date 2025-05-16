// Select DOM elements
const bodyElement = document.querySelector("body");
const navbarMenu = document.querySelector("#cs-navigation");
const hamburgerMenu = document.querySelector("#cs-navigation .cs-toggle");

// Function to toggle the aria-expanded attribute
function toggleAriaExpanded(element) {
    const isExpanded = element.getAttribute("aria-expanded");
    element.setAttribute(
        "aria-expanded",
        isExpanded === "false" ? "true" : "false",
    );
}

// Function to toggle the menu open or closed
function toggleMenu() {
    hamburgerMenu.classList.toggle("cs-active");
    navbarMenu.classList.toggle("cs-active");
    bodyElement.classList.toggle("cs-open");
    toggleAriaExpanded(hamburgerMenu);
}

// Add click event listener to the hamburger menu
hamburgerMenu.addEventListener("click", toggleMenu);

// Add click event listener to the navbar menu to handle clicks on the pseudo-element
navbarMenu.addEventListener("click", function (event) {
    if (
        event.target === navbarMenu &&
        navbarMenu.classList.contains("cs-active")
    ) {
        toggleMenu();
    }
});

// Function to handle dropdown toggle
function toggleDropdown(element) {
    element.classList.toggle("cs-active");
    const dropdownButton = element.querySelector(".cs-dropdown-button");
    if (dropdownButton) {
        toggleAriaExpanded(dropdownButton);
    }
}

// Add event listeners to each dropdown element for accessibility
const dropdownElements = document.querySelectorAll(".cs-dropdown");
dropdownElements.forEach((element) => {
    let escapePressed = false;

    element.addEventListener("focusout", function (event) {
        // Skip the focusout logic if escape was pressed
        if (escapePressed) {
            escapePressed = false;
            return;
        }

        // If the focus has moved outside the dropdown, remove the active class from the dropdown
        if (!element.contains(event.relatedTarget)) {
            element.classList.remove("cs-active");
            const dropdownButton = element.querySelector(".cs-dropdown-button");

            if (dropdownButton) {
                toggleAriaExpanded(dropdownButton);
            }
        }
    });

    element.addEventListener("keydown", function (event) {
        if (element.classList.contains("cs-active")) {
            event.stopPropagation();
        }

        // Pressing Enter or Space will toggle the dropdown and adjust the aria-expanded attribute
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            toggleDropdown(element);
        }

        // Pressing Escape will remove the active class from the dropdown. The stopPropagation above will stop the hamburger menu from closing
        if (event.key === "Escape") {
            escapePressed = true;
            toggleDropdown(element);
        }
    });

    // Handles dropdown menus on mobile - the matching media query (max-width: 63.9375rem) is necessary so that clicking the dropdown button on desktop does not add the active class and thus interfere with the hover state
    const maxWidthMediaQuery = window.matchMedia("(max-width: 63.9375rem)");
    if (maxWidthMediaQuery.matches) {
        // Fix: Separate click handlers for dropdown button and parent link
        const dropdownButton = element.querySelector(".cs-dropdown-button");
        const dropdownIcon = element.querySelector(".cs-drop-icon");
        
        if (dropdownButton && dropdownIcon) {
            // Prevent the default behavior when clicking on the dropdown icon
            dropdownIcon.addEventListener("click", function(event) {
                event.preventDefault();
                event.stopPropagation();
                toggleDropdown(element);
            });
            
            // Allow the dropdown button to navigate to its href when clicked directly
            // but not when the dropdown icon is clicked
            dropdownButton.addEventListener("click", function(event) {
                // If the click was on the icon, it's already handled
                if (event.target === dropdownIcon || dropdownIcon.contains(event.target)) {
                    event.preventDefault();
                    return;
                }
                
                // Otherwise, let the link work normally
                // No need to prevent default here
            });
        }
    }
});

// Pressing Enter will redirect to the href
const dropdownLinks = document.querySelectorAll(".cs-drop-li > .cs-li-link");
dropdownLinks.forEach((link) => {
    link.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            window.location.href = this.href;
        }
    });
});

// If you press Escape and the hamburger menu is open, close it
document.addEventListener("keydown", (event) => {
    if (
        event.key === "Escape" &&
        hamburgerMenu.classList.contains("cs-active")
    ) {
        toggleMenu();
    }
});