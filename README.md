# cf-worker-template
About the Cloudflare worker template

## 1. Set up a Worker

Starting a new Cloudflare Workers project using the wrangler CLI. If you don't have wrangler installed, install it. 

```bash
npm install -g wrangler
```

Then, initialize your project:

```bash
wrangler init cf-workers-template
```

## 2. Enable the Queues Service
Enabling Queues in your Cloudflare account and link it to your Worker.

 * Create a Queue
 ```bash 
 wrangler queueus create a1d-vectorization-test
 ```
 This will create a queue named `a1d-vectorization-test`

* Update the `wrangler.toml`
Add the queue configuration

```toml
name = "cf-workers-template"
main = "src/index.ts"
compatibility_date = "2024-04-08"

[[queues.consumers]]
queue = "a1d-vectorization-test"
binding = "cf-workers-template"
```     

## 3. Write the Worker Code
Writing a simple Worker script that integrates with a queue.
### Explanation of Code
* Enqueueing Messages: The /enqueue endpoint sends a JSON message to the queue using env.myQueue.send().
* Processing Messages: The queue handler processes batches of messages from the queue. You can define your logic for each message inside the loop.

## 4. Deploy the Worker
Deploy the Worker using wrangler

```bash
wrangler deploy
```

## 5. Test the Worker
* Enqueue a message by making a request to the /enqueue endpoint:
```bash
curl -X POST https://your-worker-subdomain.workers.dev/enqueue
```
* Check the logs in your Cloudflare dashboard or using wrangler:
```bash
wrangler tail
```
