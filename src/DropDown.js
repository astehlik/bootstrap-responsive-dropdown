(function ($) {

    var defaultSettings = {
        rightMargin: 80,
        dropdownMenuItem: '<li class="dropdown"><a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button"><span class="caret"></span></a></li>',
        dropdownMenuItemText: '... ',
        dropdownSubMenu: '<ul class="dropdown-menu pull-right" />',
        navbarMenuSelector: '.navbar-nav'
    };

    /**
     * The constructor of the DropDown class.
     *
     * @constructor
     */
    function DropDown(element, options) {

        /**
         * jQuery reference to the navbar that is made responsive.
         *
         * @type {jQuery}
         */
        var $navbar = $(element);

        /**
         * The plugin settings, see also defaultSetting at the top.
         *
         * @type {object}
         */
        var $settings = $.extend(defaultSettings, options);

        /**
         * jQuery reference to the menu inside the navbar of which the items are moved to the dropdown.
         *
         * @type {jQuery}
         */
        var $menu = $navbar.find($settings.navbarMenuSelector);

        /**
         * Array containing jQuery references to the menu items that were moved to the dropdown.
         *
         * @type {Array}
         */
        var $dropdownElements = [];

        /**
         * jQuery reference to the dropdown menu item that is added to the navbar if required.
         *
         * @type {jQuery}
         */
        var $dropdownMenuItem = null;

        /**
         * jQuery reference to the submenu of the dropdown.
         *
         * @type {jQuery}
         */
        var $dropdownSubMenu = null;

        /**
         * The offset of the first menu item. Used to determine linebreaks.
         *
         * @type {number|null}
         */
        var $initialTopOffset = null;

        /**
         * Initializes the dropdown and the resize event handling.
         */
        var init = function () {

            $(window).resize(function () {
                handleWindowResize();
            });

            moveMenuItemsToDropdown();
        };

        /**
         * Build the dropdown menu item.
         *
         * @returns {jQuery}
         */
        var buildDropdownMenuItem = function () {
            var dropdownMenuItem = $($settings.dropdownMenuItem);
            dropdownMenuItem.find('.dropdown-toggle').prepend($settings.dropdownMenuItemText);
            return dropdownMenuItem;
        };

        /**
         * Build the dropdown submenu and appends itsself to the dropdown menu item.
         *
         * @returns {jQuery}
         */
        var buildDropdownSubMenu = function () {
            $dropdownMenuItem = buildDropdownMenuItem();
            $dropdownSubMenu = $($settings.dropdownSubMenu);
            $dropdownMenuItem.append($dropdownSubMenu);
            return $dropdownMenuItem;
        };

        /**
         * Removes all dropdown elements and resets the class variables.
         */
        var destroyDropdownSubMenu = function () {
            if ($dropdownMenuItem === null) {
                return;
            }
            $initialTopOffset = null;
            $dropdownMenuItem.remove();
            $dropdownSubMenu = null;
            $dropdownMenuItem = null;
        };

        /**
         * Checks if the given list element is overlapping the available menu space.
         *
         * @param {jQuery} listElement
         * @returns {boolean}
         */
        var menuItemIsOverlapping = function (listElement) {

            if (rightEdgeOffset(listElement) > rightEdgeOffsetLimit()) {
                return true;
            }

            if ($initialTopOffset !== null && listElement.offset().top > $initialTopOffset) {
                return true;
            }

            return false;
        };

        /**
         * Loops over all menu items and if the overlap the available space they are moved
         * to a dropdown menu.
         */
        var moveMenuItemsToDropdown = function () {

            $navbar.find('li').each(function () {

                var menuItem = $(this);

                if ($initialTopOffset === null) {
                    $initialTopOffset = menuItem.offset().top;
                }

                if (!menuItemIsOverlapping(menuItem)) {
                    return;
                }

                if ($dropdownSubMenu === null) {
                    $menu.append(buildDropdownSubMenu());
                }

                $dropdownElements.push(menuItem);
                $dropdownSubMenu.append(menuItem);
            });
        };

        /**
         * Rebuilds the menu on window resize.
         */
        var handleWindowResize = function () {
            restoreOriginalMenu();
            destroyDropdownSubMenu();
            moveMenuItemsToDropdown();
        };

        /**
         * Appends the menu items that were moved do the dropdown back to the original menu.
         */
        var restoreOriginalMenu = function() {
            if ($dropdownElements.length === 0) {
                return;
            }
            var dropdownElement = $dropdownElements.shift();
            while (dropdownElement) {
                $menu.append(dropdownElement);
                dropdownElement = $dropdownElements.shift();
            }
        };

        /**
         * Returns the left offset of the right border of the given element.
         *
         * @param {jQuery} element
         * @returns {number}
         */
        var rightEdgeOffset = function (element) {
            return element.offset().left + element.outerWidth();
        };

        /**
         * Returns the maximum left offset for menu items by retrieving the right edge offset
         * of the navbar and reducing it by the configured rightMargin.
         *
         * @returns {number}
         */
        var rightEdgeOffsetLimit = function () {
            return rightEdgeOffset($navbar) - $settings.rightMargin;
        };

        init();
    }

    $.fn.bsResponsiveDropdown = function (options) {
        return this.each(function () {
            $.data(this, 'bsResponsiveDropdown', new DropDown(this, options));
        });
    };

}(jQuery));