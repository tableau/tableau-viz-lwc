@isTest(isParallel=true)
public class ObjectFieldPickListTest {
    @isTest
    static void getValues_works_with_recordPage() {
        VisualEditor.DesignTimePageContext context = new VisualEditor.DesignTimePageContext();
        context.pageType = ObjectFieldPickList.RECORD_PAGE;
        context.entityName = 'Account';
        ObjectFieldPickList pickList = new ObjectFieldPickList(context);
        VisualEditor.DynamicPickListRows rows = pickList.getValues();
        System.assert(rows.size() > 0, 'Fields not found');
    }

    @isTest
    static void getDefaultValue_work() {
        VisualEditor.DesignTimePageContext context = new VisualEditor.DesignTimePageContext();
        context.pageType = ObjectFieldPickList.RECORD_PAGE;
        context.entityName = 'Account';
        ObjectFieldPickList pickList = new ObjectFieldPickList(context);
        System.assertEquals(null, pickList.getDefaultValue());
    }
}
