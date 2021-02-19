<img src="https://img.shields.io/badge/Camunda%20DevRel%20Project-Created%20by%20the%20Camunda%20Developer%20Relations%20team-0Ba7B9">

# Letters to Santa - Automating Joy to the World, At Scale

It’s that time of year again. The time when the world’s largest order fulfillment operation experiences its heaviest load. No, not Amazon - we’re talking about Santa Claus, Inc. - the largest logistics company in the world, with a 24-hour global delivery window at peak load.

This year is different, however. Earlier this year, Saint Nick clicked on an ad on his Facebook feed, one promising a digital nomad lifestyle through automating his business. Sick of the Arctic weather and the stress of traveling, the thought of sitting on a beach in Thailand - while still bringing joy to children around the world - was enticing.

Santa paid for the course and applied the principles of process automation, task decomposition and distribution, and integration with third-party services to his business.

Now he's kicking back on a beach on Koh Samui, while the automation brings joy to the world - at scale.

So this Christmas, children’s letters to Santa are routed to independent associates (their parents), who fulfill the orders using Amazon. Santa’s successful business transformation became a case study, which we’re going to share with you here.

Here’s how it’s done.

## The Front End

Given that Santa's a modern guy, and in case he needed to supplement his retirement income with some contract front-end development work, Santa decided to do a crash course in learning to program in React.js. It seemed like the thing all the cool kids were doing, so Santa wanted to give it a shot.

While it was harder than he thought, thanks to a lot of hard-core googling, and a lot of copy-paste (remember kids, good developers copy, great developers paste!) he was able to come up with a site that at least looks passable, and handles the simple function of accepting a letter to Santa and submitting it to the process engine.

For the process engine Santa of course chose [Camunda](https://camunda.com)!

Once the form was designed, all that was left to do was submit the form using some JavaScript:

```javascript
const handleSubmit = event => {
    event.preventDefault();
    setSubmitting(true);
    if (!event.target.checkValidity()) {
      // form is invalid! so we do nothing
      return;
    }
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
      body: JSON.stringify(formData)
    };
    fetch('https://write-a-letter-to-santa.org:9091/santa', requestOptions);

    alert('Santa has been notified! You can reload the page to send another letter.');
  }
  ```
Using a simple alert to let the user know that the form was submitted was the path of least resistance, and Santa was getting lazy.

## The Process

Handling a letter by just forwarding it to the parents as-is seemed a little too lazy, even for Santa, so he quickly designed a business process using [Cawemo](https://cawemo.com) to handle the routing of the letters.

Here's what that process looks like:

![Letter to Santa Business Process](imgs/santa.png)

And here's the flow:

1) A letter comes in, which starts the process.
2) The letter is analyzed using some Natural Language Processing (NLP) algorithms to extract some parts of the letter to help figure out what the writer is asking for:
   1) Identify any items the writer is asking for.
   2) Do some Sentiment Analysis to try to figure out how important each item is to the writer.
3) If there are no items identified, then the letter is routed to a manual process where one of the Elves can do some more investigation, and update the list.
4) Once this is done, go find some possible Amazon links for the things identified.
5) Send a letter to the parents with a copy of the original letter, the items they asked for (linked to Amazon of course) and some helpful hints as to what the writer wanted most.
6) Store the product information in a local database for analysis later.

Now, before anyone tries to have Santa fined for non-compliance with GDPR, he's not storing any names, email addresses, or any other personal data. Santa already knows everything about you! He just stores the items asked for. So he can do some demand-gen analysis later, of course.

Santa wrote a pretty basic web-server in `Go` to handle the incoming letters, and submit them to the Camunda BPM processing engine:

```go
http.HandleFunc("/santa", santa)
	err := http.ListenAndServe(":9091", nil) // set listen port
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
  }
```
And then a handler function:

```go
func santa(w http.ResponseWriter, r *http.Request) {
	enableCors(&w)
	if r.Method == "GET" {
		log.Println("GET Method Not Supported")
		http.Error(w, "GET Method not supported", 400)
	} else {
		body, err := ioutil.ReadAll(r.Body)
		if err != nil {
			panic(err)
		}
		log.Println(string(body))
		var t SantaData
		err = json.Unmarshal(body, &t)
		if err != nil {
			panic(err)
		}
		log.Println(t.Letter)
		w.WriteHeader(200)
		client := camundaclientgo.NewClient(camundaclientgo.ClientOptions{
			EndpointUrl: "http://localhost:8000/engine-rest",
			ApiUser:     "demo",
			ApiPassword: "demo",
			Timeout:     time.Second * 10,
		})

		processKey := "santa"
		variables := map[string]camundaclientgo.Variable{
			"name":   {Value: t.Name, Type: "string"},
			"email":  {Value: t.ParentEmailAddress, Type: "string"},
			"letter": {Value: t.Letter, Type: "string"},
		}
		_, err = client.ProcessDefinition.StartInstance(
			camundaclientgo.QueryProcessDefinitionBy{Key: &processKey},
			camundaclientgo.ReqStartInstance{Variables: &variables},
		)
		if err != nil {
			log.Printf("Error starting process: %s\n", err)
			return
		}
	}
}
```
He did have to enable CORS to allow the cross-origin posting of data. That's rather a key point in all of this, since the server here runs on a different port than the server that handles posting the letters.

After that, a bit of magic with the [Camunda Go Client](https://github.com/citilinkru/camunda-client-go) and the letter is submitted to the Camunda BPM Process Engine.

## Natural Language Processing?

Yes, it's a form of Artificial Intelligence (AI) that allows you to break up written text and identify parts of it based on certain criteria. Done right, it can be very accurate.

So let's take a sample letter:

> Dear Santa,
>
> My name is Leon and I'm 36 years old (yeah, I still believe in Santa 😇)
>
> This year I've been the goodest kid ever, so I kinda deserve a big present...
>
> I was thinking about a nice LEGO box like the skyline kit or the New York City one. If that's not an option, I'd settle for some good chocolate too!
>
> Thank you,
> Leon

Now you and I can easily pick out the `items` in that letter that would be gifts, but it turns out that doing that is harder than it seems.

When we run that through our NLP processor we get:

```
This year I've been the goodest kid ever, so I kinda deserve a big present...
Sentiment: 0.300000, positive	Item: name	 Type: OTHER
Sentence: I was thinking about a nice LEGO box like the skyline kit or the New York City one.
Sentiment: 0.200000, positive	Item: LEGO box	 Type: OTHER
Item: skyline kit	 Type: OTHER
Sentence: If that's not an option, I'd settle for some good chocolate too!
Sentiment: 0.700000, positive	Item: option	 Type: OTHER
Item: chocolate	 Type: OTHER
Sentence: Thank you,
Leon
Sentiment: 0.800000, positive
```
Hmmm ... Not great.

If Leon had written Santa a more specific letter, we could have gotten some better results for him:

> Dear Santa,
>
> My name is Leon and I'm 36 years old (yeah, I still believe in Santa 😇)
>
> This year I've been the goodest kid ever, so I kinda deserve a big present...
>
> I was thinking about a nice Lego skyline kit or the Lego New York City Skyline Kit.
>
> If that's not an option, I'd settle for some good Belgian Chocolate too!
>
> Thank you,
> Leon

When we process that letter, we get better results:

```
Letter is 4 sentences long.
Sentence: Dear Santa, My name is Leon and I'm 36 years old (yeah, I still believe in Santa :innocent:) This year I've been the goodest kid ever, so I kinda deserve a big present...
Sentiment: 0.500000, positive	Item: name	 Type: OTHER
Item: Santa	 Type: OTHER
Sentence: I was thinking about a nice Lego skyline kit or the Lego New York City Skyline Kit.
Sentiment: 0.000000, positive	Item: skyline kit	 Type: OTHER
Item: Lego	 Type: ORGANIZATION
Item: Skyline Kit	 Type: CONSUMER_GOOD
Sentence: If that's not an option, I'd settle for some good Belgian Chocolate too!
Sentiment: 0.400000, positive	Item: option	 Type: OTHER
Item: Belgian Chocolate	 Type: CONSUMER_GOOD
Sentence: Thank you, Leon
Sentiment: 0.800000, positive
```

You'll notice that now we have identified some `CONSUMER_GOODS` in the letter, which are _much_ easier to find.

So let's see how Santa went about finding links.

## What about if there are no CONSUMER_GOODS?

That's where the magic of manual processes and forms comes in, of course. We have an exclusive gateway that checks to see if any `CONSUMER_GOODS` have been identified. If not, then it would be harder for the Amazon-search process to find anything meaningful.

This part of the process is where the Elves come into play. They didn't all lose their jobs once the whole operation was automated! But they _were_ able to join the "Work From Home" movement, so now they do their jobs from wherever they want! (Look for elves in your neighborhood!)

Let's say Leon had written a letter that just said "I want world peace. And I'd love harmony". While those are lofty ideals, they aren't really things that can be ordered from Amazon (at least not yet).

Here's the form the Elves get when a letter gets routed to them for intervention:

![When the form arrives](imgs/form1.png)

And then after the Elves have given it some thought, checked the Naughty/Nice list, they can update the items:

![Updated items form](imgs/form2.png)

The form is then routed back into the process.

There is a bit of work to do in building the form though. First thing is to build the form according to the [docs](https://docs.camunda.org/manual/7.5/reference/embedded-forms/javascript/lifecycle/). Since Santa put everything into a JSON object when the letter was parsed, he had a bit more work to do though.

```javascript
<form role="form" name="form" id="santa-form">
<h1>Edit any Gifts to make them easier to search for</h1>
  <script cam-script type="text/form-script">
    var variableManager = camForm.variableManager;

    camForm.on('form-loaded', function() {
      // fetch the variable 'gifts'
      variableManager.fetchVariable('gifts');
      console.log(variableManager.variableValue('gifts'))
    });

    camForm.on('variables-fetched', function() {
      // value has been fetched from the backend
      var value = variableManager.variableValue('gifts');
      var frm = document.getElementById('santa-form')
      var g = 0;// will be the number of gifts.
        // it's an array of Json so we have to parse it.
      var m = JSON.parse(variableManager.variables.gifts.originalValue);
      for(var x = 0; x < m.length;x++){
        for(var y = 0; y < m[x].gift.length; y++){
          var textfield = document.createElement("INPUT");
          textfield.type = "text";
          // set the ID so we know where the gift goes back in the JSON array
          textfield.id = "gift-" + x + "-" + y
          textfield.value = m[x].gift[y];
          textfield.classList.add("form-control");
          var label = document.createElement("Label");
          label.htmlFor = textfield.id;
          g++
        }
      }
    });

    camForm.on('submit', function(evt) {
      // get the form
      var frm = document.getElementById('santa-form')
      // parse the original JSON
      var m = JSON.parse(variableManager.variables.gifts.originalValue);
      // get all the inputs
      var inputs = document.forms["form"].getElementsByTagName("input");
      for(var x = 0; x < inputs.length;x++){
        var e = inputs[x].id.split("-");
        if(e.length > 0){
          m[parseInt(e[1])].gift[parseInt(e[2])] = inputs[x].value
        }
      }
      // re-stringify the updated JSON
      var final = JSON.stringify(m)
      var backendValue = variableManager.variable('gifts').value;
      if(final === backendValue) {
        // prevent submit if value of form field was not changed
        evt.submitPrevented = true;
      } else {
        // set value in variable manager so that it can be sent to backend
        variableManager.variableValue('gifts', final);
      }
    });
  </script>
</form>
```
Santa had to create all the form elements on-the-fly, and then read them back into the instance variable at the end.

Now, here's the tricky bit: If you're uploading a form along with your diagram, you can't use the easy interface provided by the Modeler. You have to use a manual process. Santa, being an old-school command-line guy, used `curl`:

```bash
curl -w “\n” — cookie cookie.txt \
  -H “Accept: application/json” \
  -F "deployment-name=santa" \
  -F "enable-duplicate-filtering=false" \
  -F "deploy-changed-only=false" \
  -F "santa.bpmn=@/Users/santa/Downloads/santa.bpmn" \
  -F "ManualLetter.html=@/Users/santa/github.com/letter-to-santa/src/ManualLetter.html" \
   http://santa-server.com:8080/engine-rest/deployment/create
```
That uploads the BPMN file and the Form to the Camunda BPM Server, and then when the manual process is called, the form shows up!

## Finding Links

Being Santa, and having an entire _year_ to plan for this, you would have thought Santa could have been better prepared, but, well, the retirement decision was sort of last-minute, and the beach in Thailand was sooo nice, he sort of forgot a few details.

The main detail he forgot was to create an Amazon Seller Account, which would have given him access to the product search API. With that, he could have done a much better job of searching for products, looking at the results, etc.

This was not the case, alas. But thankfully one of Santa's smarter elves stepped up at the last minute and told him to just use an Amazon search URL. Next year, Santa will be more prepared for this.

## Sending the Email

Since Santa didn't really want to do, well, much of anything, even the email portion was automated.

He took all the information gathered in the previous steps, and pulled it all together into a nice email to the Parents:

> Seasons Greetings!
>
> Guess what? Leon has written me a letter asking for a few things. As I've now retired to a beach in Thailand, I thought maybe you'd like to know what Lean asked for. Here's the letter:

> > "Dear Santa,
> >
> > My name is Leon and I'm 36 years old (yeah, I still believe in Santa 😇)
> >
> > This year I've been the goodest kid ever, so I kinda deserve a big present...
> >
> > I was thinking about a nice Lego skyline kit or the Lego New York City Skyline Kit.
> >
> > If that's not an option, I'd settle for some good Belgian Chocolate too!
> >
> > Thank you,
> > Leon"
>
> I've taken the liberty of figuring out which things they want most, and provided you with a list so that you can just purchase these items directly. Don't worry, the Elves are not out of work! They're working from home to monitor all the processes. And no, they are not available for purchase.
>
> So, that list:

> name ‼️
> Santa ‼️
> skyline kit ⁉️
> Lego ⁉️
> Skyline Kit ⁉️
> option ❗️
> Belgian Chocolate ❗️
>
> In case you're wondering, since I'm retired, I'm also lazy. So I've used some Artificial Intelligence (which really isn't all that intelligent) to sort of 'rate' what they asked for. I _could_ have ordered the list, but as I just told you, I'm retired, and lazy. Here's the rating system:
>
> - ⚠️: meh.
> - ⁉️: Ok, I guess.
> - ❗: Now we're talkin!
> - ‼️: Oh please! Oh Please! Oh please!
>
> All the best from me and Mrs. Claus
>
> --
> PS: Please don't write back to this email address. I'm retired!
>
> [Write your own letter!](https://write-a-letter-to-santa.org)

Santa was now done. And he didn't have to lift a finger!

## How did he do it all?

It did take writing some code, but Santa was able to use the Camunda Golang client library to handle everything.

As we saw, once the letter was submitted, the web server created a new task in Camunda and submitted it, along with all the process variables it needed to keep track of (to start with, just the `name`, `email address` and the `letter` itself). We've already seen how that was done.

But once that was submitted as a task, how was that task handled?

## Handling a task

This is the technical bit. In that same Go process that handles the incoming letters (though it could have been in a completely separate process), we listen for new tasks on the `santa` queue. Specifically, we first listen for `nlp-extraction` tasks.

First, we have to create a client for the Camunda BPM engine:

```go
client := camundaclientgo.NewClient(camundaclientgo.ClientOptions{
		EndpointUrl: "http://hostname:8080/engine-rest",
		// ApiUser:     "demo",
		// ApiPassword: "demo",
		Timeout: time.Second * 10,
	})
	logger := func(err error) {
		fmt.Println(err.Error())
  }
  ```
Once we have the client, we can begin to create some processes that watch the various task queues. So for the NLP queue:

```go
proc := processor.NewProcessor(client, &processor.ProcessorOptions{
		WorkerId:                  "nlpProcessor",
		LockDuration:              time.Second * 10,
		MaxTasks:                  10,
		MaxParallelTaskPerHandler: 100,
		LongPollingTimeout:        10 * time.Second,
	}, logger)
	// NLP Handler
	proc.AddHandler(
		&[]camundaclientgo.QueryFetchAndLockTopic{
			{TopicName: "nlp-extraction"},
		},
		func(ctx *processor.Context) error {
			fmt.Printf("Running task %s. WorkerId: %s. TopicName: %s\n", ctx.Task.Id, ctx.Task.WorkerId, ctx.Task.TopicName)
			var sentRes camundaclientgo.Variable
			var err error
			varb := ctx.Task.Variables
			text := fmt.Sprintf("%v", varb["letter"].Value)
			fmt.Println(text)
			sentRes, err = analyze(text) // <-- **this is the important bit
			if err != nil {
				log.Fatal(err)
			}
			vars := make(map[string]camundaclientgo.Variable)
			vars["status"] = camundaclientgo.Variable{Value: "true", Type: "boolean"}
			vars["gifts"] = sentRes
			err = ctx.Complete(processor.QueryComplete{
				Variables: &vars,
			})
			if err != nil {
				fmt.Printf("Error set complete task %s: %s\n", ctx.Task.Id, err)
			}
			fmt.Printf("Task %s completed\n", ctx.Task.Id)
			return nil
		},
	)
  ```
This process creation process is also provided by the [Go Client](https://github.com/citilinkru/camunda-client-go/processor).

The process is created, using the `client` created previously, and telling the process what tasks to listen for, how long to lock the task (so no one else tries to claim and process it) and then what to **do** once the task is claimed. A Camunda Client `Variable` object is created, and then the `analyze()` function is called.

The analysis function returns the `Variable` which has been filled out with all the parts identified. Those are all stored in a JSON object (represented by a `struct` in Go)

  ```go
  type Gift []struct {
	Gifts      []string `json:"gift"`
	Types      []string `json:"type"`
	Sentiments []int    `json:"sentiment"`
	Amazon     []string `json:"amazon"`
}
```
After the `analyze` function completes, the `Gifts`, `Types` and `Sentiments` are all filled out, but the `Amazon` portion is empty because we haven't done that yet.

Since we've completed the analysis of the letter, we take all the results, package them up into some new variables, and put everything back into the Camunda BPM engine.

Of course, the next step is to create a similar process to watch for tasks on the `amazon-search` queue. The process is really identical to the previous one, except that it listens for different task identifiers, and calls a different method to execute on the instance variables.

Once the `amazon-search` task is completed (and the `Amazon` portion of the data structure is filled in for each `Gift` idea), the whole thing is returned to Camunda BPM and the task is marked as completed.

Which moves it on to the `email` portion.

Again, a `processor` is defined to listen for `email` tasks, claim them, and then compose and send the email to the recipient. Once this is done, the task is marked as completed, and returned.

Finally, we have a task that stores all the `Gifts` in a database so that Santa can see what sorts of gifts people asked for this year. He may be retired, but still needs to keep a finger on the pulse of what kids want!

## Work Flow Completion

This entire workflow is extremely efficient. It generally completes in a few seconds at most. It's so fast, in fact, that Santa can't even see any processes sitting around in Cockpit! Unless there's a problem. Which there won't be, because Santa doesn't want to be disturbed.

## Areas for improvement

Of course the NLP part could be improved substantially. Santa simply used the free-tier of Google's Natural Language Processing engine, with zero adjustments, and took the results without any further analysis. (Need I remind you of Santa's laziness at this point?).

Further, the Amazon search portion could be _much_ better with an actual Amazon Reseller account. Maybe next year.

If you can think of other areas for improvement -- and there must be a lot! -- please feel free to reach out to [David G. Simmons](mailto:david.simmons@camunda.com), Principal Developer Advocate at Camunda who was responsible for helping Santa get this entire process set up.
