# Live Stats Plugin for Twilio Flex
This is a demo-grade Flex Plugin to demonstrate the presentation of realtime status and statistics for agents and tasks. It uses the [LiveQuery API](https://www.twilio.com/docs/flex/developer/ui/manager#insightsclient) to access the data and receive event-driven updates. It presents data for Flex Tasks and Workers in separate tables.

## Setup
Make sure you have [Node.js](https://nodejs.org) as well as [`npm`](https://npmjs.com). We support Node >= 12 (and recommend the _even_ versions of Node). Afterwards, install the dependencies by running `npm install`:

```bash
cd plugin-live-stats

# If you use npm
npm install
```

## Configuration
This plugin uses the Flex service configuraion object for specifying the data columns to display in the tasks and workers tables, their order, the default sort column for each table, and custom data filters. It also allows you to specify custom data columns with data drawn from Task and Worker attributes. An example of the required JSON can be found at `config.example.json`. Your configuration object must be stored under the `plugin_live_stats` key inside the `attributes` property of the Flex Service configuration object.

### Standard Columns
The plugin provides a set of standard data columns. These have the following `id` properties:

#### Tasks
- `status`
- `queue_name`
- `from`
- `channel_type`
- `worker_name`
- `formatted_age`

#### Workers
- `agent_name`
- `activity_str`
- `tasks_str`
- `skills_str`
- `contact_uri`
- `formatted_age`

### Configuration Schema Syntax
The configuration JSON schema is described below.

```bash
  plugin_live_stats: {
    tasks: {
      columns: [<column_defn>...],
      defaultSortCol: <column_id>,
      filterDefns: [<filter_defn>...]
    }
    workers: {
      columns: [<column_defn>...],
      defaultSortCol: <column_id>,
      filterDefns: [<filter_defn>...]
    }
  }
```
Column definitions are placed in an array, which defines their order left to right.

A minimal `column_defn` for a standard column looks like so:
```bash
  {id: <column_id>}
```
However, additional properties drawn from those applicable to custom columns as shown below can be specified to override the standard presentation.

A `column_defn` for a custom column has the following syntax:
```bash
  {
    id: <string>,
    numeric: 'true' | 'false',
    disablePadding: 'true' | 'false',
    label: <string>,
    field: <path-string>
  }
```

- The `id` property supplies the column ID which can then be referenced by `filterDefns` and `defaultSortCol` properties.
- The `numeric` property specifies whether the column contains numeric data. This sets whether the column values are left- or right-justified.
- The `disablePadding` property specifies whether the column values are padded by Material `TableCell` component.
- The `label` property supplies the column heading label.
- The `field` property specifies the source of data values. To display a Task or Worker attribute, the format is `attributes.<attribute_name>` .

The plugin comes with standard filters: on `status` for tasks and on `activity_name` for workers. Custom filters can also be supplied. A `filter_defn` has the following syntax:
```bash
  {
    name: <string>,
    label: <string>,
    field: <path-string>,
    options: [<option_defn>...],
    defaultOption: <string>
  }
```

- The `name` property uniquely identifies the filter's dropdown menu control.
- The `label` property supplies the dropdown menu's label.
- The `field` property specifies the source of data values used for filtering the rows displayed in the table. To filter on a Task or Worker attribute, the format is `attributes.<attribute_name>`.
- The `options` property supplies the list of values for the dropdown menu. Each value has the `option_defn` syntax: `{name: <string>, label: <string>}`. The `name` values are used in comparisons with the data.
- The `defaultOption` property specifies the default value for the filter. If not specified, the filter will start deactivated if `All` is a valid option and will be set to use the first option in the `options` list if not.

### Updating the Flex Service Configuration Object
You can update the Flex service configuration using the Flex API as described [here](https://www.twilio.com/docs/flex/ui/configuration#modifying-configuration-for-flextwiliocom). As described in that document, other plugins' configuration data should be preserved by first issuing a GET for the `attributes` data, editing the result to add in the `plugin_live_stats` property, and then issuing a POST with the edited result, as shown below using `curl`.

```bash
curl https://flex-api.twilio.com/v1/Configuration -X POST -u ACxx:auth_token \
    -H 'Content-Type: application/json' \
    -d '{
        "account_sid": "ACxx",
        "attributes": {
          <other properties>,
          "plugin_live_stats": {
            "tasks": {
              ...
            },
            "workers": {
              ...
          }
        }
    }'
```

## Development

Run `twilio flex:plugins --help` to see all the commands we currently support. For further details on Flex Plugins refer to our documentation on the [Twilio Docs](https://www.twilio.com/docs/flex/developer/plugins/cli) page.

## Usage
Click the extra icon on the navigation sidebar to bring up the sample stats page.

## NOTES
- This plugin is not suitable in its current form for production use. It is only meant to provide the reviewer with an example of how to use Flex's `insightsClient` and `LiveQuery` API to access and present realtime stats.
- This plugin is in a very early stage of development. It lacks some basic MVP features such as multi-selection filters, threshold alerting and user control over styling.
- There has been virtually no attention paid to styling.
