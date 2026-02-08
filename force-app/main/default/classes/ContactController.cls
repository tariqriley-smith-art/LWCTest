public with sharing class ContactController {
   @AuraEnabled(cacheable=true)
    public static List<Contact> getContacts(String searchText) {
        return [
            SELECT Id, Name, Email, AppointmentDate__c
            FROM Contact
            WHERE Name LIKE : '%' + searchText + '%'
            OR Email LIKE : '%' + searchText + '%'
            WITH SECURITY_ENFORCED
            ORDER BY Name ASC
            LIMIT 4
        ];         
        }

   @AuraEnabled(cacheable=true)
    public static List<Contact> getBirthdays() {
        Date today = System.today();

        return [
            SELECT Id, Name, Birthdate, Email
            FROM Contact
            WHERE CALENDAR_MONTH(Birthdate) = :today.month()
            AND DAY_IN_MONTH(Birthdate) = :today.day()
        ];
    }

    @AuraEnabled(cacheable=true)
    public static List<Absense__c> getAbsenses(String contactId) {
        Date today = System.today();
        return [
            SELECT Id, Name, Absense_Date__c, Contact__r.Name
            FROM Absense__c
            WHERE Absense_Date__c = :today
        ];
    }

     
        }