var mainMenuChoices = [
    {name: 'Create a new address book entry', value: 'CREATE'},
    {name: 'Search for existing address book entries', value: 'SEARCH'},
    {name: 'Exit the program', value: 'EXIT'}
];

var searchMenuChoices = [
    {name: 'Do another search', value: 'SEARCH_AGAIN'},
    {name: 'Go back to main menu', value: 'BACK_TO_MAIN'}
];

var viewMenuChoices = [
    {name: 'Edit the current entry', value: 'EDIT'},
    {name: 'Delete the current entry', value: 'DELETE'},
    {name: 'Go back to main menu', value: 'BACK_TO_MAIN'}
];

module.exports = {
    main: mainMenuChoices,
    search: searchMenuChoices,
    view: viewMenuChoices
};