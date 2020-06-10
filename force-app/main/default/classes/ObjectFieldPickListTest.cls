@isTest(isParallel=true)
public class ObjectFieldPickListTest {
    @isTest
    static void getValues_works_with_recordPage() {
        ObjectFieldPickList pickList = new ObjectFieldPickList(
            ObjectFieldPickList.RECORD_PAGE,
            'Account'
        );
        VisualEditor.DynamicPickListRows rows = pickList.getValues();
        System.assert(rows.size() > 0, 'Fields not found');
    }

    @isTest
    static void getDefaultValue_work() {
        ObjectFieldPickList pickList = new ObjectFieldPickList(
            ObjectFieldPickList.RECORD_PAGE,
            'Account'
        );
        System.assertEquals(null, pickList.getDefaultValue());
    }
}
