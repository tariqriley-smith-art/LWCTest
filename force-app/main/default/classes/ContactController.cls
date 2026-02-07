public with sharing class ContactController {
  @AuraEnabled(cacheable=true)
    public static List<Contact> getContacts(String searchText) {
        return [
            SELECT Id, Name, Email, AppointmentDate__c
            FROM Contact
            WHERE Name LIKE : '%' + searchText + '%'
            WITH SECURITY_ENFORCED
            ORDER BY Name ASC
            LIMIT 50
            
        ];         
        }
}
