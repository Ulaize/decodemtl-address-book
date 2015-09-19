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

function buildBasicQuestions(defaultEntry) {
    return [
        {
            name: 'firstName',
            message: 'First Name',
            validate: notEmpty,
            default: defaultEntry.firstName
        },
        {
            name: 'lastName',
            message: 'Last Name',
            validate: notEmpty,
            default: defaultEntry.lastName
        },
        {
            name: 'birthday',
            message: 'Birthday (optional)',
            default: defaultEntry.birthday
        },
        {
            type: 'checkbox',
            name: 'addressTypes',
            message: 'Choose the type(s) of address(es) you want to add',
            choices: ab.AddressBook.SUB_ENTRY_TYPES,
            default: Object.keys(defaultEntry.addresses)
        },
        {
            type: 'checkbox',
            name: 'phoneTypes',
            message: 'Choose the type(s) of phone(s) you want to add',
            choices: ab.AddressBook.SUB_ENTRY_TYPES,
            default: Object.keys(defaultEntry.phones)
        },
        {
            type: 'checkbox',
            name: 'emailTypes',
            message: 'Choose the type(s) of emails(s) you want to add',
            choices: ab.AddressBook.SUB_ENTRY_TYPES,
            default: Object.keys(defaultEntry.emails)
        }
    ];
}

function buildAddressQuestions(defaultEntry, addressType) {
    var defaultAddress = defaultEntry.addresses[addressType] || new ab.Address();
    var prefix = capitalize(addressType) + ' ';
    return [
        {
            type: 'input',
            name: 'address1',
            message: prefix+'Address Line 1',
            validate: notEmpty,
            default: defaultAddress.line1
        },
        {
            type: 'input',
            name: 'address2',
            message: prefix+'Address Line 2 (optional)',
            default: defaultAddress.line2
        },
        {
            type: 'input',
            name: 'city',
            message: prefix+'City',
            validate: notEmpty,
            default: defaultAddress.city
        },
        {
            type: 'input',
            name: 'province',
            message: prefix+'Province',
            validate: notEmpty,
            default: defaultAddress.province
        },
        {
            type: 'input',
            name: 'postalCode',
            message: prefix+'Postal Code',
            validate: notEmpty,
            default: defaultAddress.postalCode
        },
        {
            type: 'input',
            name: 'country',
            message: prefix+'Country',
            validate: notEmpty,
            default: defaultAddress.country
        }
    ];
}

function buildEmailQuestions(defaultEntry, emailType) {
    var defaultEmail = defaultEntry.emails[emailType] || new ab.Email();
    var prefix = capitalize(emailType) + ' ';
    return [
        {
            type: 'input',
            name: 'emailAddress',
            message: prefix+'Email Address',
            validate: notEmpty,
            default: defaultEmail.emailAddress
        }
    ];
}

function buildPhoneQuestions(defaultEntry, phoneType) {
    var defaultPhone = defaultEntry.phones[phoneType] || new ab.Phone();
    
    var prefix = capitalize(phoneType) + ' ';
    return [
        {
            type: 'list',
            name: 'phoneKind',
            message: prefix+'Phone Type',
            choices: ab.Phone.PHONE_TYPES,
            default: defaultPhone.phoneType
        },
        {
            type: 'input',
            name: 'phoneNumber',
            message: prefix+'Phone Number',
            validate: notEmpty,
            default: defaultPhone.phoneNumber
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