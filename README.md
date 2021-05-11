# Live Stats Plugin for Twilio Flex

This is a demo-grade Flex Plugin to demonstrate the presentation of realtime status and statistics for agents and calls. It uses the [LiveQuery API](https://www.twilio.com/docs/flex/developer/ui/manager#insightsclient) to access the data and receive event-driven updates.

## Setup

Make sure you have [Node.js](https://nodejs.org) as well as [`npm`](https://npmjs.com). We support Node >= 12 (and recommend the _even_ versions of Node). Afterwards, install the dependencies by running `npm install`:

```bash
cd plugin-live-stats

# If you use npm
npm install
```

## Development

Run `twilio flex:plugins --help` to see all the commands we currently support. For further details on Flex Plugins refer to our documentation on the [Twilio Docs](https://www.twilio.com/docs/flex/developer/plugins/cli) page.

## Usage
Click the extra icon on the navigation sidebar to bring up the sample stats page.

## NOTES
- This plugin is not suitable in its current form for production use. It is only meant to provide the reviewer with an example of how to use Flex's `insightsClient` and `LiveQuery` API to access and present realtime stats.
- This plugin is in a very early stage of development. It lacks basic MVP features such as sorting, filtering and threshold alerting.
- There has been virtually no attention paid to styling.
