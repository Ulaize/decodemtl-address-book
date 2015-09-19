function AddressBook() {
    this.entries = {};
}

AddressBook.SUB_ENTRY_TYPES = ['home', 'work', 'other'];
AddressBook.CURRENT_ID = 0;

AddressBook.prototype = {
    addEntry: function(entry) {
        var id = AddressBook.CURRENT_ID;
        AddressBook.CURRENT_ID++;
        entry.id = id;
        entry.addressBook = this;
        this.entries[id] = entry;
    },
    deleteEntry: function(entry) {
        delete this.entries[entry.id];
    },
    findEntriesByName: function(name) {
        var ab = this;
        var results = [];
        Object.keys(ab.entries).forEach(function(key) {
            var e = ab.entries[key];
            if (e.firstName.indexOf(name) >= 0 || e.lastName.indexOf(name) >= 0) {
                results.push(e);
            }
            else {
                Object.keys(e.emails).some(function(emailKey) {
                    var email = e.emails[emailKey];
                    if (email.emailAddress.indexOf(name) >= 0) {
                        results.push(e);
                        return true;
                    }
                });
            }
        });
        return results;
    }
};





function Entry(firstName, lastName) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.addresses = {};
    this.phones = {};
    this.emails = {};
}

Entry.prototype = {
    setBirthday: function(bday) {
        this.birthday = bday;
    },
    setAddress: function(addressType, address) {
        this.addresses[addressType] = address;
    },
    setEmail: function(emailType, email) {
        this.emails[emailType] = email;
    },
    setPhone: function(phoneType, phone) {
        this.phones[phoneType] = phone;
    }
};





function Address(type, line1, city, province, postalCode, country) {
    this.type = type;
    this.line1 = line1;
    this.city = city;
    this.province = province;
    this.postalCode = postalCode;
    this.country = country;
}

Address.prototype = {
    setLine2: function(line2) {
        this.line2 = line2;
    },
    toString: function() {
        return [
            this.line1,
            this.line2,
            this.city + ", " + this.province + " " + this.postalCode,
            this.country
        ].join("\n");
    }
};





function Phone(type, phoneType, phoneNumber) {
    this.type = type;
    this.phoneType = phoneType;
    this.phoneNumber = phoneNumber;
}

Phone.PHONE_TYPES = ['landline', 'cellular', 'fax'];

Phone.prototype = {
    toString: function() {
        return this.phoneNumber + "(" + this.phoneType + ")";
    }
};





function Email(type, emailAddress) {
    this.type = type;
    this.emailAddress = emailAddress;
}

Email.prototype = {
    toString: function() {
        return this.emailAddress;
    }
};





module.exports = {
    AddressBook: AddressBook,
    Entry: Entry,
    Address: Address,
    Phone: Phone,
    Email: Email
};