var ab = require('./address-book');
var Table = require('cli-table');
var colors = require('colors');

function notEmpty(value) {
    return value.length > 0;
}

function answeredYes(questionName, answers) {
    return answers[questionName] === true;
}

function capitalize(str) {
    return str[0].toUpperCase() + str.substr(1);
}

function buildBasicQuestions() {
    return [
        {
            name: 'firstName',
            message: 'First Name',
            validate: notEmpty
        },
        {
            name: 'lastName',
            message: 'Last Name',
            validate: notEmpty
        },
        {
            name: 'birthday',
            message: 'Birthday (optional)'
        },
        {
            type: 'checkbox',
            name: 'addressTypes',
            message: 'Choose the type(s) of address(es) you want to add',
            choices: ab.AddressBook.SUB_ENTRY_TYPES
        },
        {
            type: 'checkbox',
            name: 'phoneTypes',
            message: 'Choose the type(s) of phone(s) you want to add',
            choices: ab.AddressBook.SUB_ENTRY_TYPES
        },
        {
            type: 'checkbox',
            name: 'emailTypes',
            message: 'Choose the type(s) of emails(s) you want to add',
            choices: ab.AddressBook.SUB_ENTRY_TYPES
        }
    ];
}

function buildAddressQuestions(addressType) {
    var prefix = capitalize(addressType) + ' ';
    return [
        {
            type: 'input',
            name: 'address1',
            message: prefix+'Address Line 1',
            validate: notEmpty
        },
        {
            type: 'input',
            name: 'address2',
            message: prefix+'Address Line 2 (optional)'
        },
        {
            type: 'input',
            name: 'city',
            message: prefix+'City',
            validate: notEmpty
        },
        {
            type: 'input',
            name: 'province',
            message: prefix+'Province',
            validate: notEmpty
        },
        {
            type: 'input',
            name: 'postalCode',
            message: prefix+'Postal Code',
            validate: notEmpty
        },
        {
            type: 'input',
            name: 'country',
            message: prefix+'Country',
            validate: notEmpty
        }
    ];
}

function buildEmailQuestions(emailType) {
    var prefix = capitalize(emailType) + ' ';
    return [
        {
            type: 'input',
            name: 'emailAddress',
            message: prefix+'Email Address',
            validate: notEmpty
        }
    ];
}

function buildPhoneQuestions(phoneType) {
    var prefix = capitalize(phoneType) + ' ';
    return [
        {
            type: 'list',
            name: 'phoneKind',
            message: prefix+'Phone Type',
            choices: ab.Phone.PHONE_TYPES
        },
        {
            type: 'input',
            name: 'phoneNumber',
            message: prefix+'Phone Number',
            validate: notEmpty
        }
    ];
}

function getTableForEntry(entry) {
    var entryTable = new Table();
    entryTable.push(
        {'First Name': entry.firstName},
        {'Last Name': entry.lastName}
    );
    
    entry.birthday && entryTable.push({'Birthday': entry.birthday});
    
    var addressKeys = Object.keys(entry.addresses);
    if (addressKeys.length) {
        var addressesContent = [];
        addressKeys.forEach(function(addressType) {
            addressesContent.push(addressType.bold.underline + "\n" + entry.addresses[addressType].toString());
        });
        
        entryTable.push({'Addresses': addressesContent.join("\n\n")});
    }
    
    var phoneKeys = Object.keys(entry.phones);
    if (phoneKeys.length) {
        var phonesContent = [];
        phoneKeys.forEach(function(phoneType) {
            phonesContent.push(phoneType.bold.underline + ": " + entry.phones[phoneType].toString());
        });
        
        entryTable.push({'Phones': phonesContent.join("\n")});
    }
    
    var emailKeys = Object.keys(entry.emails);
    if (emailKeys.length) {
        var emailsContent = [];
        emailKeys.forEach(function(emailType) {
            emailsContent.push(emailType.bold.underline + ": " + entry.emails[emailType].toString());
        });
        
        entryTable.push({'Emails': emailsContent.join("\n")});
    }
    
    return entryTable;
}

module.exports = {
    notEmpty: notEmpty,
    buildBasicQuestions: buildBasicQuestions,
    buildAddressQuestions: buildAddressQuestions,
    buildEmailQuestions: buildEmailQuestions,
    buildPhoneQuestions: buildPhoneQuestions,
    getTableForEntry: getTableForEntry
};