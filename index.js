var ab = require('./lib/address-book');
var menus = require('./lib/menus');
var prompt = require('./lib/inquirer-promisified');
var helpers = require('./lib/helpers');

start();
function start() {
    var addressBook = new ab.AddressBook();
    mainProgramLoop(addressBook);
}
function mainProgramLoop(addressBook) {
    return displayMenu('main').then(function(mainMenuChoice) {
        
        switch(mainMenuChoice) {
            case 'CREATE':
                return createEntry(addressBook)
                    .then(displayEntry)
                    .then(mainProgramLoop.bind(null, addressBook));
            case 'SEARCH':
                return searchEntries(addressBook).then(mainProgramLoop.bind(null, addressBook));
            case 'EXIT':
                break;
            default:
                console.error("Invalid choice, please try again.");
                mainProgramLoop(addressBook);
        }
    });
}

function displayMenu(menuName) {
    return prompt([
        {
            type: 'list',
            name: 'menuAnswer',
            message: 'What do you want to do?',
            choices: menus[menuName]
        }
    ]).then(function(answers) {
        return answers.menuAnswer;
    });
}

function createEntry(addressBook) {
    return promptEntry().then(function(entry) {
        addressBook.addEntry(entry);
        return entry;
    });
}

function promptEntry(originalEntry) {
    originalEntry = originalEntry || new ab.Entry();
    
    return prompt(helpers.buildBasicQuestions(originalEntry)).bind({}).then(function(basicAnswers) {
        this.basicAnswers = basicAnswers;
        return this.basicAnswers.addressTypes.map(helpers.buildAddressQuestions.bind(null, originalEntry));
        
    }).map(function(addressQuestions) {
        return prompt(addressQuestions);
    }, {concurrency: 1}).then(function(addressAnswers) {
        this.addressAnswers = addressAnswers;
        
        return this.basicAnswers.emailTypes.map(helpers.buildEmailQuestions.bind(null, originalEntry));
    }).map(function(emailQuestions) {
        return prompt(emailQuestions);
    }, {concurrency: 1}).then(function(emailAnswers) {
        this.emailAnswers = emailAnswers;
        
        return this.basicAnswers.phoneTypes.map(helpers.buildPhoneQuestions.bind(null, originalEntry));
    }).map(function(phoneQuestions) {
        return prompt(phoneQuestions);
    }, {concurrency: 1}).then(function (phoneAnswers) {
        this.phoneAnswers = phoneAnswers;
    }).then(function() {
        // Here we have all the answers, we can create the entry!
        var all = this;
        
        var entry = new ab.Entry(all.basicAnswers.firstName, all.basicAnswers.lastName);
        if (helpers.notEmpty(all.basicAnswers.birthday)) {
            entry.setBirthday(all.basicAnswers.birthday);
        }
        
        // Addresses
        all.basicAnswers.addressTypes.forEach(function(addressType, i) {
            var answers = all.addressAnswers[i];
            var address = new ab.Address(addressType, answers.address1, answers.city, answers.province, answers.postalCode, answers.country);
            if (helpers.notEmpty(answers.address2)) {
                address.setLine2(answers.address2);
            }
            entry.setAddress(addressType, address);
        });
        
        // Emails
        all.basicAnswers.emailTypes.forEach(function(emailType, i) {
            var answers = all.emailAnswers[i];
            var email = new ab.Email(emailType, answers.emailAddress);
            entry.setEmail(emailType, email);
        });
        
        // Phones
        all.basicAnswers.phoneTypes.forEach(function(phoneType, i) {
            var answers = all.phoneAnswers[i];
            var phone = new ab.Phone(phoneType, answers.phoneKind, answers.phoneNumber);
            entry.setPhone(phoneType, phone);
        });
        
        return entry;
    }).bind();
}

function editEntry(entry) {
    return promptEntry(entry);
}

function deleteEntry(entry) {
    return prompt([{type: 'confirm', name: 'confirm', message: 'Are you sure?'}])
        .then(function(results) {
            if (results.confirm) {
                entry.addressBook.deleteEntry(entry);
            }
            return results.confirm;
        });
}

function displayEntry(entry) {
    var entryTable = helpers.getTableForEntry(entry);
    console.log(entryTable.toString());
    
    return displayMenu('view').then(function(viewMenuChoice) {
        switch(viewMenuChoice) {
            case 'EDIT':
                return editEntry(entry)
                    .then(displayEntry);
            case 'DELETE':
                return deleteEntry(entry)
                    .then(function(wasDeleted) {
                        if (!wasDeleted) {
                            return displayEntry(entry);
                        }
                    });
            case 'BACK_TO_MAIN':
                break;
            default:
                console.error("Invalid choice, please try again.");
                return displayEntry(entry);
        }
    });
}


function searchEntries(addressBook) {
    return prompt([{name: 'name', message: 'Enter a name to search for'}])
        .then(function(answers) {
            return addressBook.findEntriesByName(answers.name);
        })
        .then(function(entries) {
            if (!entries.length) {
                console.log("No entries were found".bold);
            }
            var menuOptions = entries.map(function(entry) {
                return {name: [entry.lastName.bold, entry.firstName].join(', '), value: entry};
            }).concat(menus.search);
            
            return prompt([{name: 'opt', message: 'What do you want to do?', type: 'list', choices: menuOptions}]);
        })
        .then(function(answers) {
            if (answers.opt === 'SEARCH_AGAIN') {
                return searchEntries(addressBook);
            }
            else if (answers.opt === 'BACK_TO_MAIN') {
                return;
            }
            else {
                return displayEntry(answers.opt);
            }
        });
}