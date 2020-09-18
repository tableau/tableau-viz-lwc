global with sharing class ObjectFieldPickList extends VisualEditor.DynamicPickList {
    @TestVisible
    private static final String RECORD_PAGE = 'RecordPage';

    private VisualEditor.DynamicPickListRows rows;

    @TestVisible
    public ObjectFieldPickList(String pageType, String objectName) {
        this.rows = getRows(pageType, objectName);
    }

    global ObjectFieldPickList(VisualEditor.DesignTimePageContext context) {
        this.rows = getRows(context.pageType, context.entityName);
    }

    private VisualEditor.DynamicPickListRows getRows(
        String pageType,
        String objectName
    ) {
        VisualEditor.DynamicPickListRows rows = new VisualEditor.DynamicPickListRows();
        if (pageType == RECORD_PAGE) {
            Map<String, Schema.SObjectField> fields = getObjectFields(
                objectName
            );
            Set<String> fieldNames = fields.keySet();
            for (String fieldName : fieldNames) {
                Schema.SObjectField field = fields.get(fieldName);
                Schema.DescribeFieldResult fieldInfo = field.getDescribe();
                String qualifiedFieldName =
                    objectName +
                    '.' +
                    fieldInfo.getName();
                rows.addRow(
                    new VisualEditor.DataRow(
                        fieldInfo.getLabel(),
                        qualifiedFieldName
                    )
                );
            }
        }
        return rows;
    }

    private Map<String, Schema.SObjectField> getObjectFields(
        String objectName
    ) {
        String[] objectNames = new List<String>{ objectName };
        Schema.DescribeSobjectResult[] objects = Schema.describeSObjects(
            objectNames
        );
        Schema.DescribeSobjectResult objectInfo = objects[0];
        return objectInfo.fields.getMap();
    }

    global override VisualEditor.DataRow getDefaultValue() {
        return null;
    }

    global override VisualEditor.DynamicPickListRows getValues() {
        return this.rows;
    }
}
