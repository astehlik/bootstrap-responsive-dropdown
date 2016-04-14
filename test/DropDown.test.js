
QUnit.module('dropDown', {
    beforeEach: function() {
        var testarea = $('#testarea');
        testarea.empty();
        testarea.append($('#qunit-fixture').find('nav.navbar'));
        this.mainContainer = testarea.find('.container');
        this.navbar = testarea.find('.navbar-collapse');
    }
});

QUnit.test('noDropdownIsAddedIfWidthIsSufficient', 1, function (assert) {
    this.mainContainer.width(1000);
    this.navbar.bsResponsiveDropdown();
    assert.equal(this.mainContainer.find('.dropdown-menu').length, 0);
});

QUnit.test('dropdownContainsExpectedNumberOfElementsIfScreenWidhtIsTooSmall', 1, function (assert) {
    this.mainContainer.width(200);
    this.navbar.bsResponsiveDropdown();
    assert.equal(this.mainContainer.find('.dropdown-menu li').length, 4);
});

QUnit.test('dropdownElementsAreAdjustedIfWindowSizeChanges', 2, function (assert) {
    this.mainContainer.width(200);
    this.navbar.bsResponsiveDropdown();
    assert.equal(this.mainContainer.find('.dropdown-menu li').length, 4);
    this.mainContainer.width(400);
    $(window).trigger('resize');
    assert.equal(this.mainContainer.find('.dropdown-menu li').length, 1);
});

QUnit.test('dropdownIsInitializedOnWindowResize', 2, function (assert) {
    this.mainContainer.width(1000);
    this.navbar.bsResponsiveDropdown();
    assert.equal(this.mainContainer.find('.dropdown-menu').length, 0);
    this.mainContainer.width(400);
    $(window).trigger('resize');
    assert.equal(this.mainContainer.find('.dropdown-menu li').length, 1);
});
