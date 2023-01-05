# Electricity price alert to LINE

Sends notifications to a LINE channel when electricity (denki) price is gets high or low.

I gave up making a LINE account public because broadcasting messages on LINE is costy.  
So you need to prepare infrastractures like LINE account etc by yourself.

# Architecture

A scheduled function on Cloudflare fetches electricity prices from an external API every 30 mins (You can customize the frequency if you want).  
If the price is on alert (expensive) o cheap, it sends a message to a LINE channel.

# Requirements
- Cloudflare account
- LINE Channel access token / Channel secret
- Node.js (>= 16.x)
- pnpm

# Installation

```bash
pnpm add -g wrangler # Run only if you do not have wrangler installed
pnpm i --frozen-lockfile
wrangler secret put CHANNEL_ACCESS_TOKEN <LINE Channel access token>
wrangler secret put CHANNEL_SECRET <LINE Channel secret>
```

# Deployment

```bash
wrangler publish
```

# License
MIT
