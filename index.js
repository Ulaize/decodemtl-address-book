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
    displayMainMenu().then(function(mainMenuChoice) {
        
        switch(mainMenuChoice) {
            case 'CREATE':
                createEntry(addressBook)
                    .then(displayEntry)
                    .then(mainProgramLoop.bind(null, addressBook));
                break;
            case 'SEARCH':
                searchEntries(addressBook).then(mainProgramLoop.bind(null, addressBook));
                break;
            case 'EXIT':
                break;
            default:
                console.error("Invalid choice, please try again.");
                mainProgramLoop(addressBook);
        }
    });
}

function displayMainMenu() {
    return prompt([
        {
            type: 'list',
            name: 'mainMenuAnswer',
            message: 'What do you want to do?',
            choices: menus.main
        }
    ]).then(function(answers) {
        return answers.mainMenuAnswer;
    });
}

function createEntry(addressBook) {
    return prompt(helpers.buildBasicQuestions()).bind({}).then(function(basicAnswers) {
        this.basicAnswers = basicAnswers;
        return this.basicAnswers.addressTypes.map(helpers.buildAddressQuestions);
        
    }).map(function(addressQuestions) {
        return prompt(addressQuestions);
    }, {concurrency: 1}).then(function(addressAnswers) {
        this.addressAnswers = addressAnswers;
        
        return this.basicAnswers.emailTypes.map(helpers.buildEmailQuestions);
    }).map(function(emailQuestions) {
        return prompt(emailQuestions);
    }, {concurrency: 1}).then(function(emailAnswers) {
        this.emailAnswers = emailAnswers;
        
        return this.basicAnswers.phoneTypes.map(helpers.buildPhoneQuestions);
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
        
        addressBook.addEntry(entry);
        return entry;
    }).bind();
}

function displayEntry(entry) {
    var entryTable = helpers.getTableForEntry(entry);
    console.log(entryTable.toString());
}

function displayEntryMenu() {
    
}

function searchEntries(addressBook) {
    
}

function exitProgram() {
    
}