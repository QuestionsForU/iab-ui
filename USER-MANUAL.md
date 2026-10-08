# iLab UI User Manual

This manual explains how to sign in and use the iLab UI business management application. The screens and available actions can vary by account permissions.

## Contents

- [Getting started](#getting-started)
- [Navigate the application](#navigate-the-application)
- [Use management lists](#use-management-lists)
- [Add or edit a record](#add-or-edit-a-record)
- [Work with invoices](#work-with-invoices)
- [Profile and account](#profile-and-account)
- [Troubleshooting](#troubleshooting)

## Getting started

1. Open the application URL provided by your organization.
2. Enter your registered email address and password on the sign-in page.
3. Select **Login**. If sign-in succeeds, the dashboard opens.

Access requires an account created or authorized by your system administrator. If you do not have an account or cannot sign in, contact the administrator. The **Recover Password** link currently directs users to contact the administrator; password recovery is not self-service.

The dashboard welcomes you and displays the name and email associated with your signed-in account.

## Navigate the application

Use the left-hand navigation menu to open a section. The menu may be collapsed on smaller screens; use the menu toggle to show or hide it. Sections and options may be hidden if your account does not have access.

| Menu section | Available screens |
| --- | --- |
| Dashboard | Dashboard |
| Inventory | Suppliers, Category, Product, Supplier Purchase |
| Sales | Invoice, Sale Order |
| Customer | Customer |
| Settings | Daily Price, Purity, Site Settings |
| Configuration | User Management, Module Management |

Select your name/profile area in the top-right corner to access **Change Password**, **View Profile**, and **Logout**. Use **Logout** when finished, especially on a shared computer.

## Use management lists

Most management sections open a list of existing records.

- **Open a record:** Select its linked name or identifier in the list.
- **Edit a record:** Select the pencil icon on its row, or open the record and select **Edit** if available.
- **Search:** Enter a search term in the Search box and select **Search**. Searchable fields vary by section.
- **Sort:** Select a sortable column heading to change the sort order.
- **Change pages:** Use the page controls at the bottom of a paginated list, when present.
- **Add:** Select **Add New** if the button is available and your account permits it.

Not every section supports all of these actions. For example, the current Customer list does not show an Add New action, and some records may only be viewable or editable. The application does not currently provide a general delete action in these lists.

## Add or edit a record

1. Open the appropriate section from the navigation menu.
2. Select **Add New** to create a record, or open a record and select **Edit**.
3. Enter the requested information. Required fields are indicated on the form; selection fields may offer predefined options or values from another section.
4. Review the information and select **Save**.
5. If you do not want to keep your changes, select **Cancel**.

If the application marks a field as required or displays a validation message, correct the field before saving. You may need to maintain related records first—for example, a product may refer to a purity and category, and a flat may refer to a project, tower, or floor.

### Examples of information requested

- **Product:** Name, weight, type, purity, unit, category, HSN code, tax rates, and product ownership/type.
- **Supplier:** Name, email, GST number, phone number, address, and optional profile picture.
- **Customer:** Name, phone number, PAN number, and address when editing an existing record.
- **Daily Price:** Price date, material/purity information, and price.

The exact fields and required values depend on the section and may change as the application is updated.

## Developer guide: creating a module

A module in this application is more than a form. To add one, connect its Firestore collection and reusable page schemas to the router and navigation menu, then provide any required Firestore indexes and access configuration. The Invoice module is an example: its page components are in `src/pages/app/schema/Invoices.jsx`, its routes are registered in `src/routes/index.jsx`, its menu entry is in `src/pages/common/LeftMenu.jsx`, and its collection index is in `firestore.indexes.json`.

### 1. Choose the module and route names

Decide on:

- A singular Firestore collection/module name, such as `invoice`.
- A route path, such as `/invoices`.
- A display label and the menu group where users should find it.
- The fields, relationships, and allowed actions (list, search, add, view, edit).

The module name is passed to the shared data components as `schema.module`; it must match the Firestore collection name. Existing routes usually use a plural path, but the shared page component constructs some navigation paths by appending `s` to the module name. Keep module and route naming consistent, and inspect the resulting add/view/edit/back URLs—especially for irregular plurals or names with multiple words.

### 2. Create the module page schemas

Create `src/pages/app/schema/<ModuleName>.jsx` (for example, `Invoices.jsx`). Most modules export separate list, view, add, and edit components and reuse `IUIList` and `IUIPage`:

```jsx
import IUIList from "../../common/IUIList";
import IUIPage from "../../common/IUIPage";

export const ListExample = () => (
  <IUIList
    schema={{
      module: "example",
      title: "Example Management",
      paging: true,
      searching: true,
      editing: true,
      adding: true,
      fields: [
        { text: "Name", field: "name", type: "link", sorting: true, searching: true },
      ],
    }}
  />
);
```

Use a schema object for each page, as the Invoice screens do, when the form fields or read-only/action settings differ. Form fields are described in `fields`; common properties include `text`, `field`, `type`, `required`, and `width`. Use existing schemas for field types, lookups, and inline relations. For linked lookup values, specify the related collection in the field's `schema.module`; for fixed choices, provide `schema.items`.

### 3. Register the routes

In `src/routes/index.jsx`:

1. Import each exported component from the new schema file.
2. Add its paths inside the authenticated route's `children`.
3. Register the screens needed by the module, typically:

```jsx
{ path: "/examples", element: <ListExample /> },
{ path: "/examples/:id", element: <ViewExample /> },
{ path: "/examples/add", element: <AddExample /> },
{ path: "/examples/:id/edit", element: <EditExample /> },
```

Follow the actual Invoice route declarations in this file. Add and edit routes are separate from list/view routes; defining a page component alone does not make it reachable.

### 4. Add the navigation item

In `src/pages/common/LeftMenu.jsx`, add a menu item under the appropriate section. For example:

```jsx
{ name: "example", text: "Example", icon: "box-open", path: "/examples" }
```

The menu item path must match the list route. The menu and router are separate registrations, so update both. Review the application's privilege handling and user/role setup for the intended access; a menu entry by itself does not secure a route or Firestore data.

### 5. Add Firestore indexes when needed

The shared list query in `src/store/firebase-service.js` filters on `application` and, by default, sorts by `dateCreated` descending. Add an index for the new collection in `firestore.indexes.json` when its queries require one. The common pattern is:

```json
{
  "collectionGroup": "example",
  "queryScope": "COLLECTION",
  "fields": [
    { "fieldPath": "application", "order": "ASCENDING" },
    { "fieldPath": "dateCreated", "order": "DESCENDING" }
  ]
}
```

Use the singular Firestore module/collection name for `collectionGroup`. Add or adjust indexes for other filters and sort orders required by the new screens. If Firestore reports a missing index, review its suggested definition, add it to the checked-in file, and deploy it to the intended Firebase project:

```powershell
firebase deploy --project <project-id> --only firestore:indexes
```

### 6. Check data metadata, access, and relationships

`src/store/firebase-service.js` adds shared metadata when creating documents, including `status`, `schema`, `user`, `dateCreated`, `application`, and `access`. Understand these defaults and verify they are appropriate before relying on them. Review Firestore rules for the new collection; do not assume client-side menu visibility or form permissions provide database security.

If a screen uses child/related records, study `module-relation-inline` in the Invoice schemas and the shared relation component before copying the pattern. Confirm how the relation is stored and queried, and ensure the related collection, lookup fields, routes (if needed), and indexes are all in place.

### 7. Verify the complete user flow

- Confirm the menu entry opens the list route.
- Test list loading, search, sorting, and pagination if enabled.
- Test add, save, view, edit, cancel, required-field validation, and related lookups as applicable.
- Test with accounts that should and should not have access.
- Check browser console and Firestore errors; add and deploy any required index.
- Verify Firestore rules and deploy only to the approved Firebase project.

## Work with invoices

1. Open **Sales → Invoice**.
2. Select **Add New** if available.
3. Enter the invoice number, date, customer details, payment mode, discount, and address requested by the form.
4. Add the invoice item information requested, such as product, quantity, weight, rate, HSN code, taxes, and charges.
5. Review the invoice and select **Save**.

When viewing an existing invoice, use **Edit** if you need to make a permitted correction. Confirm customer and item details before saving. If an expected action is not available, ask your administrator to check your permissions or the application's current configuration.

## Profile and account

Open the profile menu in the top-right corner:

- **View Profile:** Review your profile details.
- **Change Password:** Open the password change screen and follow its prompts.
- **Logout:** End your current session.

If you forget your password, use **Recover Password** on the sign-in page to see the administrator contact instruction. If your account is locked, missing a menu section, or has incorrect details, contact your system administrator.

## Troubleshooting

| Problem | What to try |
| --- | --- |
| Login fails | Check your email and password, then try again. If the problem continues, contact the administrator. |
| A section or button is missing | Your account may not have permission, or that action may not be enabled in the current application. Contact the administrator. |
| A record cannot be saved | Check required fields and any validation messages. Make sure related records selected in lookup fields exist. |
| A list is empty or search returns no results | Clear the search and select **Search** again. Check that you are in the correct section. |
| A page displays an error or remains blank | Refresh the page once. If it continues, note the section and action you were performing and report it to support. |

Do not share your password. When reporting a problem, provide the page/section and a description of the steps that led to it; do not send passwords or sensitive customer information.
