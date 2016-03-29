/* * * * * * * * * * * * * * * * * * * *
 Mobile Menu
 * * * * * * * * * * * * * * * * * * * */

var MobileNavi = (function ()
{
    var $container = $('#mobile-menu-container');
    var $element = $('.mobile-navi', $container);
    var $wrapper = $('.wrapper');
    var $footer = $('#footer');
    var $hiddenLevel1Item;
    var $nestedItem;
    var $nestedItemIndex;
    var isOpen = false;

    var bindListeners = function()
    {
        // Show Menu when triggered
        $('#mobile-navi-trigger').click(function(e) {
            e.stopPropagation();
            if (isOpen) {
                close();
            } else {
                open();
            }
        });

        // Swipe events to open/close menu
        $(window).on('swiperight', function () {
            open();
        });
        $(window).on('swipeleft', function () {
            close();
        });

        // If the clicked item has Subpages -> open the next level
        $('.hasSub > a', $element).on('click', function(e) {
            e.preventDefault();
            toggleSubmenu($(this).parent());
        });

        // If level-2 item with subpage is clicked ->
        $('> li.hasSub > ul > li.hasSub.lvl-2 > a', $element).on('click', function(e) {
            e.preventDefault();
            level2ItemClicked($(this));
        });
    };

    var open = function()
    {
        if (!isOpen) {
            $container.addClass('visible');
            $wrapper.addClass('indented');
            $footer.addClass('indented');

            // Event handler for when user taps outside the mobile menu
            $wrapper.on('click', function (e) {
                //e.stopPropagation();
                close();
                $(this).off();
            });
        }

        isOpen = true;
    };

    var close = function()
    {
        if (isOpen) {
            // Make sure the menu is only set to hidden after the slide transition ended
            $wrapper.on('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function() {
                $container.removeClass('visible');
                $(this).off();
            });

            $wrapper.removeClass('indented');
            $footer.removeClass('indented');
        }

        isOpen = false;
    };

    var toggleSubmenu = function($li)
    {
        // Close nested menu if there is one
        if ($li.hasClass('lvl-1') || $li.hasClass('lvl-2')) {
            $('li.back-btn', $element).click();
        }

        // Close other open Submenus
        $li.closest('ul').find('.open').not($li).removeClass('open');

        $li.toggleClass('open');
    };

    var level2ItemClicked = function($level2ItemLink)
    {
        $nestedItem = $level2ItemLink.parent();
        $nestedItemIndex = $nestedItem.index();

        var $level1item = $nestedItem.parent().parent();

        $level1item.removeClass('open');
        // Insert Back-Button
        $level1item.before(getBackButton());
        // Insert nested Item
        $level1item.before($nestedItem);

        $hiddenLevel1Item = $level1item;
        // Remove 1st level of clicked item
        $level1item.detach();

        $level2ItemLink.unbind('click');
    };

    var backButtonClicked = function($backButton)
    {
        // Collapse Submenus
        $($nestedItem).removeClass('open');
        $('ul li', $nestedItem).removeClass('open');

        $backButton.after($hiddenLevel1Item);

        $hiddenLevel1Item.addClass('open');

        // Insert the nested level-2 item back into the level-1 menu
        $('ul li', $hiddenLevel1Item).eq($nestedItemIndex).before($nestedItem);

        $backButton.remove();

        // Add click event listener again
        $('> a', $nestedItem).click(function(e) {
            e.preventDefault();
            level2ItemClicked($(this));
        });

        $('> a', $nestedItem).on('click', function(e) {
            e.preventDefault();
            $(this).parent().toggleClass('open');
        });
    };

    var getBackButton = function()
    {
        var $backButton = $('<li class="back-btn"><a href="javascript:;">« Zurück</a></li>');

        // add event listener
        $backButton.click(function() {
            backButtonClicked($(this));
        });

        return $backButton;
    };

    var init = function()
    {
        var $current = $('li.current', $element);

        if ($current.hasClass('lvl-2')) {
            // Open the active level-1 item
            $current.parent().parent().addClass('open');

        } else if ($current.hasClass('lvl-3') || $current.hasClass('lvl-4')) {
            $current.closest('li.lvl-2').find('> a').click();

            // If current is a level-4 item -> open the active level-3 item
            if ($current.hasClass('lvl-4')) {
                $current.parent().parent().addClass('open');
            }
        }
    };

    return {
        init: function() {
            bindListeners();
            init();
        }
    }

})();

MobileNavi.init();