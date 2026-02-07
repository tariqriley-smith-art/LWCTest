public with sharing class ContactController {
  @AuraEnabled(cacheable=true)
    public static List<Contact> getContacts(String searchText) {
        if(searchText == ''){
            return null;
        }
        else {
              return [
            SELECT Id, Name, Email, Phone
            FROM Contact
            WHERE Name LIKE : '%' + searchText + '%'
            WITH SECURITY_ENFORCED
            LIMIT 50
        ];         
        }
    

}
}
