function AddressBook() {
    this.entries = [];
}

AddressBook.SUB_ENTRY_TYPES = ['home', 'work', 'other'];

AddressBook.prototype = {
    
};





function Entry(firstName, lastName) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.addresses = {};
    this.phones = {};
    this.emails = {};
}

Entry.prototype = {
    
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
    
};





function Phone(type, phoneType, phoneNumber) {
    this.type = type;
    this.phoneType = phoneType;
    this.phoneNumber = phoneNumber;
}

Phone.PHONE_TYPES = ['landline', 'cellular', 'fax'];

Phone.prototype = {
    
};





function Email(type, emailAddress) {
    this.type = type;
    this.emailAddress = emailAddress;
}

Email.prototype = {
    
};





module.exports = {
    
}