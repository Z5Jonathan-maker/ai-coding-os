---
source: "https://www.youtube.com/watch?v=t3YJ5hKiMQ0"
kind: video
title: "Building makemore Part 5: Building a WaveNet"
retrieved: "2026-05-04T07:27:22+00:00"
word_count: 11129
char_count: 66281
source_url: "https://www.youtube.com/watch?v=t3YJ5hKiMQ0"
---

# Building makemore Part 5: Building a WaveNet

# Building makemore Part 5: Building a WaveNet

- **Source:** https://www.youtube.com/watch?v=t3YJ5hKiMQ0
- **Uploader:** Andrej Karpathy
- **Duration:** 0:56:21

## Description

We take the 2-layer MLP from previous video and make it deeper with a tree-like structure, arriving at a convolutional neural network architecture similar to the WaveNet (2016) from DeepMind. In the WaveNet paper, the same hierarchical architecture is implemented more efficiently using causal dilated convolutions (not yet covered). Along the way we get a better sense of torch.nn and what it is and how it works under the hood, and what a typical deep learning development process looks like (a lot of reading of documentation, keeping track of multidimensional tensor shapes, moving between jupyter notebooks and repository code, ...).

Links:
- makemore on github: https://github.com/karpathy/makemore
- jupyter notebook I built in this video: https://github.com/karpathy/nn-zero-to-hero/blob/master/lectures/makemore/makemore_part5_cnn1.ipynb
- collab notebook: https://colab.research.google.com/drive/1CXVEmCO_7r7WYZGb5qnjfyxTvQa13g5X?usp=sharing
- my website: https://karpathy.ai
- my twitter: https://twitter.com/karpathy
- our Discord channel: https://discord.gg/3zy8kqD9Cp

Supplementary links:
- WaveNet 2016 from DeepMind https://arxiv.org/abs/1609.03499
- Bengio et al. 2003 MLP LM https://www.jmlr.org/papers/volume3/bengio03a/bengio03a.pdf 

Chapters:
intro
00:00:00 intro
00:01:40 starter code walkthrough
00:06:56 let’s fix the learning rate plot
00:09:16 pytorchifying our code: layers, containers, torch.nn, fun bugs
implementing wavenet
00:17:11 overview: WaveNet
00:19:33 dataset bump the context size to 8
00:19:55 re-running baseline code on block_size 8
00:21:36 implementing WaveNet
00:37:41 training the WaveNet: first pass
00:38:50 fixing batchnorm1d bug
00:45:21 re-training WaveNet with bug fix
00:46:07 scaling up our WaveNet
conclusions
00:46:58 experimental harness
00:47:44 WaveNet but with “dilated causal convolutions”
00:51:34 torch.nn
00:52:28 the development process of building deep neural nets
00:54:17 going forward
00:55:26 improve on my loss! how far can we improve a WaveNet on this data?

## Transcript

**[0:00:00]** Hi everyone. Today we are continuing our implementation of Make More,

**[0:00:03]** our favorite character-level language model. Now you'll notice that the background behind me

**[0:00:08]** is different, that's because I am in Kyoto and it is awesome, so I'm in the hotel room here.

**[0:00:13]** Now over the last few lectures we've built up to this architecture that is a multi-layer perceptron

**[0:00:19]** character-level language model. So we see that it receives three previous characters and tries

**[0:00:22]** to predict the fourth character in a sequence using a very simple multi-layer perceptron

**[0:00:27]** using one hidden layer of neurons with tenational nearities. So what we'd like to do now in this

**[0:00:32]** lecture is I'd like to complexify this architecture. In particular, we would like to take more characters

**[0:00:37]** in a sequence as an input, not just three, and in addition to that we don't just want to feed

**[0:00:42]** them all into a single hidden layer because that squashes too much information too quickly,

**[0:00:47]** instead we would like to make a deeper model that progressively fuses this information to

**[0:00:52]** make its guess about the next character in a sequence. And so we'll see that as we make this

**[0:00:57]** architecture more complex we're actually going to arrive at something that looks very much like a

**[0:01:02]** WaveNet. So WaveNet is this paper published by Define in 2016 and it is also a language model

**[0:01:10]** basically, but it tries to predict audio sequences instead of character-level sequences

**[0:01:15]** or word-level sequences. But fundamentally the modeling setup is identical, it is an

**[0:01:20]** auto-aggressive model and it tries to predict the next character in a sequence and the architecture

**[0:01:25]** actually takes this interesting hierarchical approach to predicting the next character in a

**[0:01:31]** sequence with this tree-like structure. And this is the architecture and we're going to implement

**[0:01:37]** it in the course of this video. So let's get started. So the starter code for part five

**[0:01:42]** is very similar to where we ended up in in part three. Recall that part four was the

**[0:01:47]** manual back propagation exercise that is kind of an aside. So we are coming back to part three,

**[0:01:51]** copy-pasting chunks out of it and that is our starter code for part five. I've changed very

**[0:01:55]** few things otherwise. So a lot of this should look familiar to you if you've gone through part three.

**[0:02:00]** So in particular, very briefly, we are doing imports. We are reading our dataset of words

**[0:02:06]** and we are processing the dataset of words into individual examples and none of this data

**[0:02:12]** generation code has changed. And basically we have lots and lots of examples

**[0:02:16]** in particular we have 182,000 examples of three characters trying to predict the fourth one.

**[0:02:23]** And we've broken up every one of these words into little problems of given three characters

**[0:02:27]** predict the fourth one. So this is our dataset and this is what we're trying to get the neural

**[0:02:31]** lab to do. Now in part three, we started to develop our code around these layer modules

**[0:02:39]** that are for example a class linear. And we're doing this because we want to think of

**[0:02:43]** these modules as building blocks and like a Lego building block bricks that we can sort of like

**[0:02:48]** stack up into neural networks. And we can feed data between these layers and stack them up into

**[0:02:54]** sort of graphs. Now we also developed these layers to have APIs and signatures very similar

**[0:03:01]** to those that are found in PyTorch. So we have Torch.nn and it's got all these

**[0:03:05]** layer building blocks that you would use in practice. And we were developing all of these

**[0:03:09]** to mimic APIs of these. So for example, we have linear. So there will also be a Torch.nn.linear

**[0:03:16]** and its signature will be very similar to our signature and the functionality will be also

**[0:03:20]** quite identical as far as I'm aware. So we had the linear layer with the bachelor 1d layer

**[0:03:26]** and the 10h layer that we developed previously. And linear just does a matrix multiply in the

**[0:03:31]** forward pass of this module. Batch number of course is this crazy layer that we developed

**[0:03:36]** in the previous lecture. And what's crazy about it is, well, there's many things. Number one,

**[0:03:42]** it has these running mean and variances that are trained outside of back propagation. They are

**[0:03:47]** trained using exponential moving average inside this layer when we call the forward pass.

**[0:03:54]** In addition to that, there's this training flag because the behavior of best room is

**[0:03:59]** different during train time and evaluation time. And so suddenly we have to be very

**[0:04:02]** careful that best room is in its correct state that it's in the evaluation state or training state.

**[0:04:07]** So that's something to now keep track of something that sometimes introduces bugs

**[0:04:11]** because you forget to put it into the right mode. And finally we saw that bachelor couples

**[0:04:16]** the statistics or the activations across the examples in the batch. So normally we thought

**[0:04:22]** of the batch as just an efficiency thing. But now we are coupling the computation across

**[0:04:28]** batch elements. And it's done for the purposes of controlling the activation statistics as we saw

**[0:04:33]** in the previous video. So it's a very weird layer, at least a lot of bugs. Partly, for example,

**[0:04:39]** because you have to modulate the training in eval phase and so on. In addition, for example,

**[0:04:45]** you have to wait for the mean and the variance to settle and to actually reach a steady state.

**[0:04:51]** And so you have to make sure that you basically there's state in this layer and state is harmful

**[0:04:57]** usually. Now I brought out the generator object. Previously we had a generator equals G and so

**[0:05:05]** on inside these layers. I've discarded that in favor of just initializing the Torch RNG outside here

**[0:05:12]** using just once globally, just for simplicity. And then here we are starting to build out

**[0:05:18]** some of the neural network elements. This should look very familiar. We have our embedding

**[0:05:23]** table C. And then we have a list of players. And it's a linear feeds to bachelor feeds to 10h.

**[0:05:29]** And then a linear output layer and its weights are scaled down. So we are not confidently wrong

**[0:05:34]** at initialization. We see that this is about 12,000 parameters. We're telling PyTorch that

**[0:05:40]** the parameters require gradients. The optimization is as far as I'm aware,

**[0:05:44]** identical and should look very, very familiar. Nothing changed here.

**[0:05:49]** Last function looks very crazy. We should probably fix this. And that's because 32 batch

**[0:05:55]** elements are too few. And so you can get very lucky or unlucky in any one of these batches.

**[0:06:01]** And it creates a very thick last function. So we're going to fix that soon.

**[0:06:06]** Now, once we want to evaluate the train neural network, we need to remember,

**[0:06:10]** because of the bachelor layers, to set all the layers to be training equals false.

**[0:06:14]** This only matters for the bachelor layer so far. And then we evaluate.

**[0:06:20]** We see that currently we have a validation loss of 2.10, which is fairly good, but there's still

**[0:06:25]** ways to go. But even at 2.10, we see that when we sample from the model, we actually get

**[0:06:31]** relatively name-like results that do not exist in a training set. So for example,

**[0:06:36]** evon, kilo, pros, alia, et cetera. So certainly not reasonable. Not unreasonable, I would say,

**[0:06:46]** but not amazing. And we can still push this validation loss even lower and get much better

**[0:06:50]** samples that are even more name-like. So let's improve this model. Okay, first,

**[0:06:57]** let's fix this graph because it is daggers in my eyes and I just can't take it anymore.

**[0:07:01]** So loss-high, if you recall, is a Python list of floats. So for example, the first 10 elements

**[0:07:08]** look like this. Now, what we'd like to do basically is we need to average up some of these values to

**[0:07:15]** get a more sort of representative value along the way. So one way to do this is the following.

**[0:07:21]** In PyTorch, if I create, for example, a tensor of the first 10 numbers, then this is currently

**[0:07:28]** a one-dimensional array. But recall that I can view this array as two-dimensional. So for example,

**[0:07:33]** I can view it as a two-by-five array. And this is a 2D tensor now, two-by-five. And you see what

**[0:07:39]** PyTorch has done is that the first row of this tensor is the first five elements. And the second

**[0:07:44]** row is the second five elements. I can also view it as a five-by-two as an example.

**[0:07:50]** And then recall that I can also use negative one in place of one of these numbers.

**[0:07:56]** In PyTorch, we'll calculate what that number must be in order to make the number of elements

**[0:08:00]** work out. So this can be this or like that. Both will work. Of course, this would not work.

**[0:08:09]** Okay, so this allows it to spread out some of the consecutive values into rows. So that's very

**[0:08:14]** helpful because what we can do now is, first of all, we're going to create a torsha tensor

**[0:08:19]** out of the list of floats. And then we're going to view it as whatever it is. But we're going to

**[0:08:26]** stretch it out into rows of 1000 consecutive elements. So the shape of this now becomes

**[0:08:32]** 200 by 1000. And each row is 1000 consecutive elements in this list. So that's very helpful

**[0:08:40]** because now we can do a mean along the rows. And the shape of this will just be 200.

**[0:08:46]** And so we've taken basically the mean on every row. So plt.plot of that should be something nicer.

**[0:08:53]** That's better. So we see that we've basically made a lot of progress. And then here, this is the

**[0:08:58]** learning rate decay. So here we see that the learning rate decay subtracted a ton of energy

**[0:09:03]** out of the system and allowed us to settle into sort of the local minimum in this optimization.

**[0:09:09]** So this is a much nicer plot. Let me come up and delete the monster. And we're going to

**[0:09:14]** be using this going forward. Now, next up, what I'm bothered by is that you see our forward pass is

**[0:09:21]** a little bit gnarly and takes way too many lines of code. So in particular, we see that we've

**[0:09:25]** organized some of the layers inside the layers list, but not all of them for no reason. So in

**[0:09:31]** particular, we see that we still have the embedding table special case outside of the layers.

**[0:09:36]** And in addition to that, the viewing operation here is also outside of our layers.

**[0:09:41]** So let's create layers for these, and then we can add those layers to just our list.

**[0:09:46]** So in particular, the two things that we need is here, we have this embedding table,

**[0:09:51]** and we are indexing at the integers inside the batch xb inside a tensor xb. So that's an

**[0:09:59]** embedding table lookup just done with indexing. And then here we see that we have this view

**[0:10:04]** operation, which if you recall from the previous video, simply rearranges the

**[0:10:09]** character embeddings and stretches them out into row. And effectively, what that does is the

**[0:10:15]** concatenation operation, basically, except it's free because viewing is very cheap in PyTorch.

**[0:10:21]** And no memories being copied. We're just re-representing how we view that tensor.

**[0:10:25]** So let's create modules for both of these operations, the embedding operation and

**[0:10:31]** the flattening operation. So I actually wrote the code just to save some time.

**[0:10:38]** So we have a module embedding and a module flatten, and both of them simply do the

**[0:10:43]** indexing operation in the forward pass and the flattening operation here.

**[0:10:49]** And this c now will just become a salt.weight inside an embedding module.

**[0:10:56]** And I'm calling these layers specifically embedding and flatten because it turns out that

**[0:11:00]** both of them actually exist in PyTorch. So in PyTorch, we have n and n dot embedding.

**[0:11:05]** And it also takes the number of embeddings and the dimensionality of the embedding,

**[0:11:09]** just like we have here. But in addition, PyTorch takes a lot of other keyword

**[0:11:12]** arguments that we are not using for our purposes yet. And for flatten, that also exists

**[0:11:19]** in PyTorch. And it also takes additional keyword arguments that we are not using.

**[0:11:23]** So we have a very simple flatten. But both of them exist in PyTorch, they're just a bit

**[0:11:28]** more simpler. And now that we have these, we can simply take out some of these special cased

**[0:11:37]** things. So instead of c, we're just going to have an embedding and a vocab size and n embed.

**[0:11:45]** And then after the embedding, we are going to flatten. So let's construct those modules.

**[0:11:50]** And now I can take out this c. And here I don't have to special case it anymore,

**[0:11:55]** because now C is the embedding's weight. And it's inside layers. So this should just work.

**[0:12:04]** And then here, our forward pass simplifies substantially, because we don't need to do

**[0:12:08]** these now outside of these layer outside and explicitly. They're now inside layers.

**[0:12:15]** So we can delete those. But now to kick things off, we want this little x,

**[0:12:20]** which in the beginning is just xb, the tensor of integers, specifying the identities of these

**[0:12:25]** characters at the input. And so these characters can now directly feed into the first layer.

**[0:12:30]** And this should just work. So let me come here and insert a break, because I just

**[0:12:35]** want to make sure that the first iteration of this runs and that there's no mistake.

**[0:12:39]** So that ran properly. And basically, we've substantially simplified the forward pass here.

**[0:12:44]** Okay, I'm sorry, I changed my microphone. So hopefully the audio is a little bit better.

**[0:12:49]** Now, one more thing that I would like to do in order to pytorchify our code even further

**[0:12:53]** is that right now we are maintaining all of our modules in a naked list of layers.

**[0:12:58]** And we can also simplify this, because we can introduce the concept of pytorch containers.

**[0:13:03]** So in torch.nn, which we are basically rebuilding from scratch here, there's a concept

**[0:13:07]** of containers. And these containers are basically a way of organizing layers into lists

**[0:13:13]** or dicts and so on. So in particular, there's a sequential, which maintains a list of layers,

**[0:13:19]** and is a module class in pytorch. And it basically just passes a given input through all

**[0:13:25]** the layers sequentially, exactly as we are doing here. So let's write our own sequential.

**[0:13:30]** I've written a code here. And basically, the code for sequential is quite straightforward.

**[0:13:35]** We pass in a list of layers, which we keep here. And then given any input in a forward pass,

**[0:13:41]** we just call all the layers sequentially and return the result. And in terms of the parameters,

**[0:13:45]** it's just all the parameters of the child modules. So we can run this and we can again,

**[0:13:50]** simplify this substantially, because we don't maintain this naked list of layers, we now have

**[0:13:54]** a notion of a model, which is a module. And in particular is a sequential of all these layers.

**[0:14:04]** And now parameters are simply just model parameters. And so that list comprehension

**[0:14:10]** now lives here. And then here we are press, here we are doing all the things we used to do.

**[0:14:17]** Now here, the code again simplifies substantially, because we don't have to do this forwarding here,

**[0:14:23]** instead we just call the model on the input data. And the input data here are the integers

**[0:14:27]** inside XB. So we can simply do logits, which are the outputs of our model,

**[0:14:33]** are simply the model called on XB. And then the cross entropy here takes the logits and

**[0:14:39]** the targets. So this simplifies substantially. And then this looks good. So let's just make

**[0:14:46]** sure this runs. That looks good. Now here, we actually have some work to do still here,

**[0:14:51]** but I'm going to come back later. For now, there's no more layers, there's a model that layers,

**[0:14:56]** but it's not a to access attributes of these classes directly. So we'll come back and fix

**[0:15:01]** this later. And then here, of course, this simplifies substantially as well, because

**[0:15:06]** logits are the model called on X. And then these logits come here. So we can evaluate

**[0:15:15]** the train of validation loss, which currently is terrible because we just initialized a neural

**[0:15:19]** net. And then we can also sample from the model. And this simplifies dramatically as well,

**[0:15:24]** because we just want to call the model onto the context and outcome logits.

**[0:15:30]** And then these logits go into softmax and get the probabilities, et cetera.

**[0:15:34]** So we can sample from this model. What did I screw up? Okay, so I fixed the issue and we now get the

**[0:15:44]** result that we expect, which is gibberish, because the model is not trained because we

**[0:15:48]** re initialize it from scratch. The problem was that when I fixed this cell to be modeled out layers

**[0:15:54]** instead of just layers, I did not actually run the cell. And so our neural net was in a training

**[0:15:59]** mode. And what caused the issue here is the bathroom layer as bathroom layer often likes to

**[0:16:04]** do, because bathroom was in a training mode. And here we are passing in an input, which is a batch

**[0:16:09]** of just a single example made up of the context. And so if you are trying to pass in a single example

**[0:16:15]** into a batch norm that is in the training mode, you're going to end up estimating the variance

**[0:16:19]** using the input. And the variance of a single number is not a number, because it is a measure

**[0:16:24]** of a spread. So for example, the variance of just a single number five, you can see is not a

**[0:16:29]** number. And so that's what happened. And the bathroom basically caused an issue, and then

**[0:16:35]** that polluted all of the further processing. So all that we had to do was make sure that this

**[0:16:40]** runs. And we basically made the issue of, again, we didn't actually see the issue with the loss.

**[0:16:47]** We could have evaluated the loss, but we got the wrong result because bathroom was in the training

**[0:16:51]** mode. And, and so we still get a result is just the wrong result, because it's using the

**[0:16:57]** sample statistics of the batch. Whereas we want to use the running mean and running variance

**[0:17:01]** inside the bachelor. And so again, an example of introducing a bug in line, because we did not

**[0:17:08]** properly maintain the state of what is training or not. Okay, so I rerun everything. And here's

**[0:17:13]** where we are. As a reminder, we have the training loss of 2.05 and validation 2.10.

**[0:17:18]** Now, because these losses are very similar to each other, we have a sense that we are not

**[0:17:23]** overfitting too much on this task. And we can make additional progress in our performance

**[0:17:27]** by scaling up the size of the neural network and making everything bigger and deeper.

**[0:17:32]** Now, currently, we are using this architecture here, where we are taking in some number of

**[0:17:36]** characters going into a single hidden layer, and then going to the prediction of the next

**[0:17:40]** character. The problem here is we don't have a naive way of making this bigger in a productive

**[0:17:46]** way. We could, of course, use our layers sort of building blocks and materials to introduce

**[0:17:52]** additional layers here and make the network deeper. But it is still the case that we are

**[0:17:56]** crushing all of the characters into a single layer all the way at the beginning. And even

**[0:18:01]** if we make this a bigger layer and add neurons, it's all kind of like silly to squash all that

**[0:18:06]** information so fast in a single step. So we'd like to do instead is we'd like our network

**[0:18:12]** to look a lot more like this in the WaveNet case. So you see in the WaveNet, when we are

**[0:18:16]** trying to make the prediction for the next character in the sequence, it is a function

**[0:18:20]** of the previous characters that feed in, but not all of these different characters are not

**[0:18:26]** just crushed to a single layer and then you have a sandwich. They are crushed slowly.

**[0:18:32]** So in particular, we take two characters and we fuse them into sort of like a bi-gram

**[0:18:36]** representation. And we do that for all these characters consecutively. And then we take

**[0:18:40]** the bi-grams and we fuse those into four character level chunks. And then we fuse that

**[0:18:47]** again. And so we do that in this like tree-like hierarchical manner. So we fuse the information

**[0:18:53]** from the previous context slowly into the network as it gets deeper. And so this is the

**[0:18:58]** kind of architecture that we want to implement. Now in the WaveNet's case, this is a visualization

**[0:19:03]** of a stack of dilated causal convolution layers. And this makes it sound very scary,

**[0:19:08]** but actually the idea is very simple. And the fact that it's a dilated causal convolution

**[0:19:12]** layer is really just an implementation detail to make everything fast. We're going to see

**[0:19:15]** that later. But for now, let's just keep the basic idea of it, which is this progressive fusion.

**[0:19:21]** So we want to make the network deeper. And at each level, we want to fuse only two consecutive

**[0:19:26]** elements, two characters, then two bi-grams, then two four-grams, and so on. So let's implement this.

**[0:19:32]** Okay, so first up, let me scroll to where we built the dataset. And let's change the block

**[0:19:36]** size from three to eight. So we're going to be taking eight characters of context

**[0:19:41]** to predict the ninth character. So the dataset now looks like this. We have a lot more context

**[0:19:46]** feeding in to predict any next character in a sequence. And these eight characters are going

**[0:19:50]** to be processed in this tree-like structure. Now if we scroll here, everything here should just

**[0:19:56]** be able to work. So we should be able to redefine the network. You see that the

**[0:20:00]** number of parameters has increased by 10,000. And that's because the block size has grown.

**[0:20:05]** So this first linear layer is much, much bigger. Our linear layer now takes eight

**[0:20:10]** characters into this middle layer. So there's a lot more parameters there. But this should just run.

**[0:20:16]** Let me just break right after the very first iteration. So you see that this runs just fine.

**[0:20:21]** It's just that this network doesn't make too much sense. We're crushing way too much information,

**[0:20:25]** way too fast. So let's now come in and see how we could try to implement the hierarchical

**[0:20:30]** scheme. Now before we dive into the detail of the re-implementation here, I was just curious

**[0:20:35]** to actually run it and see where we are in terms of the baseline performance of just lazily scaling up

**[0:20:40]** the context length. So I'll let it run. We get a nice loss curve. And then evaluating the loss,

**[0:20:46]** we actually see quite a bit of improvement just from increasing the context length. So I started

**[0:20:51]** a little bit of a performance log here. And previously where we were is we were getting

**[0:20:55]** performance of 2.10 on the validation loss. And now simply scaling up the context length

**[0:21:00]** from 3 to 8 gives us a performance of 2.02. So quite a bit of an improvement here.

**[0:21:06]** And also when you sample from the model, you see that the names are definitely improving

**[0:21:10]** qualitatively as well. So we could of course spend a lot of time here tuning,

**[0:21:16]** tuning things and making it even bigger and scaling up the network further,

**[0:21:19]** even with this simple sort of setup here. But let's continue and let's implement here

**[0:21:25]** model and treat this as just a rough baseline performance. But there's a lot of optimization

**[0:21:31]** like left on the table in terms of some of the hyperparameters that you're hopefully getting a

**[0:21:35]** sense of now. Okay, so let's scroll up now and come back up. And what I've done here is I've

**[0:21:41]** created a bit of a scratch space for us to just like look at the forward pass of the neural

**[0:21:45]** net and inspect the shape of the tensors along the way as the neural net forwards.

**[0:21:52]** So here I'm just temporarily for debugging, creating a batch of just say four examples,

**[0:21:57]** so four random integers, then I'm plucking out those rows from our training set,

**[0:22:02]** and then I'm passing into the model the input XP. Now the shape of XP here because we have only

**[0:22:08]** four examples is four by eight, and this eight is now the current block size. So inspecting

**[0:22:16]** XP, we just see that we have four examples, each one of them is a row of XP, and we have eight

**[0:22:23]** characters here. And this integer tensor just contains the identities of those characters.

**[0:22:29]** So the first layer of our neural net is the embedding layer. So passing XP,

**[0:22:33]** this integer tensor through the embedding layer creates an output that is four by eight by 10.

**[0:22:39]** So our embedding table has for each character a 10 dimensional vector that we are trying to

**[0:22:45]** learn. And so what the embedding layer does here is it blocks out the embedding vector for each one

**[0:22:52]** of these integers and organizes it all in a four by eight by 10 tensor now. So all of these integers

**[0:22:59]** are translated into 10 dimensional vectors inside this three dimensional tensor now.

**[0:23:04]** Now passing that through the flatten layer, as you recall, what this does is it views

**[0:23:09]** this tensor as just a four by 80 tensor. And what that effectively does is that all these

**[0:23:15]** 10 dimensional embeddings for all these eight characters just end up being

**[0:23:18]** stretched out into a long row. And that looks kind of like a concatenation operation basically.

**[0:23:24]** So by viewing the tensor differently, we now have a four by 80. And inside this 80, it's all the

**[0:23:30]** 10 dimensional vectors just concatenating next to each other. And the linear layer of course

**[0:23:37]** takes 80 and creates 200 channels just via matrix multiplication. So so far so good. Now I'd like to

**[0:23:45]** show you something surprising. Let's look at the insides of the linear layer and remind ourselves

**[0:23:51]** how it works. The linear layer here in the forward pass takes the input x, multiplies it

**[0:23:56]** with a weight and then optionally adds a bias. And the weight here is two dimensional as

**[0:24:01]** defined here. And the bias is one dimensional here. So effectively in terms of the shapes

**[0:24:06]** involved, what's happening inside this linear layer looks like this right now.

**[0:24:10]** And I'm using random numbers here, but I'm just illustrating the shapes and what happens.

**[0:24:16]** Basically a four by 80 input comes into the linear layer gets multiplied by this 80 by 200

**[0:24:21]** weight matrix inside. And there's a plus 200 bias. And the shape of the whole thing that

**[0:24:25]** comes out of the linear layer is four by 200, as we see here. Now notice here by the way that

**[0:24:32]** this here will create a four by 200 tensor and then plus 200. There's a broadcasting happening here,

**[0:24:39]** but four by 200 broadcasts with 200. So everything works here. So now the surprising thing that

**[0:24:45]** I'd like to show you that you may not expect is that this input here that is being multiplied

**[0:24:51]** doesn't actually have to be two dimensional. This matrix multiply operator in PyTorch is

**[0:24:56]** quite powerful. And in fact, you can actually pass in higher dimensional arrays or tensors

**[0:25:00]** and everything works fine. So for example, this could be four by five by 80. And the result in that

**[0:25:04]** case will become four by five by 200. You can add as many dimensions as you like on the left here.

**[0:25:11]** And so effectively what's happening is that the matrix multiplication only works on the last

**[0:25:16]** dimension. And the dimensions before it in the input tensor are left unchanged.

**[0:25:24]** So that is basically these, these dimensions on the left are all treated as just a batch

**[0:25:29]** dimension. So we can have multiple batch dimensions. And then in parallel over all those dimensions,

**[0:25:36]** we are doing the matrix multiplication on the last dimension. So this is quite convenient because

**[0:25:41]** we can use that in our network now. Because remember that we have these eight characters

**[0:25:46]** coming in. And we don't want to now flatten all of it out into a large eight dimensional

**[0:25:53]** vector. Because we don't want to a matrix multiply 80 into a weight matrix multiply

**[0:26:01]** immediately. Instead, we want to group these like this. So every consecutive two elements,

**[0:26:09]** one, two and three and four and five and six and seven and eight, all of these should be now

**[0:26:14]** basically flattened out and multiplied by a weight matrix. But all of these four groups

**[0:26:19]** here, we'd like to process in parallel. So it's kind of like a batch dimension that we can introduce.

**[0:26:25]** And then we can in parallel, basically process all of these by Graham groups in the four batch

**[0:26:33]** dimensions of an individual example, and also over the actual batch dimension of the, you know,

**[0:26:39]** four examples in our example here. So let's see how that works. Effectively, what we want

**[0:26:44]** is right now, we take a four by 80 and multiply by 80 by 200 to in the linear layer. This is what

**[0:26:52]** happens. But instead of what we want is, we don't want 80 characters or 80 numbers to come in. We

**[0:26:59]** only want two characters to come in on the very first layer. And those two characters should be

**[0:27:03]** fused. So in other words, we just want 20 to come in, right? 20 numbers would come in.

**[0:27:11]** And here we don't want a four by 80 to feed into the linear layer. We actually want these groups

**[0:27:16]** of two to feed in. So instead of four by 80, we want this to be a four by four by 20.

**[0:27:23]** So these are the four groups of two. And each one of them is 10 dimensional vector.

**[0:27:29]** So what we want is now is we need to change the flatten layer. So it doesn't output a four

**[0:27:33]** by 80, but it outputs a four by four by 20, where basically these every two consecutive characters

**[0:27:42]** are packed in on the very last dimension. And then these four is the first batch dimension.

**[0:27:48]** And this four is the second batch dimension referring to the four groups inside every one

**[0:27:53]** of these examples. And then this will just multiply like this. So this is what we want

**[0:27:58]** to get to. So we're going to have to change the linear layer in terms of how many inputs

**[0:28:02]** it expects. It should expect 80. It should just expect 20 numbers. And we have to change our

**[0:28:08]** flatten layer. So it doesn't just fully flatten out this entire example. It needs to create a four

**[0:28:13]** by four by 20 instead of a four by 80. So let's see how this could be implemented. Basically,

**[0:28:19]** right now we have an input that is a four by eight by 10 that feeds into the flatten layer.

**[0:28:25]** And currently the flatten layer just stretches it out. So if you remember the implementation

**[0:28:29]** of flatten, it takes our X and just views it as whatever the batch dimension is and then negative

**[0:28:35]** one. So effectively what it does right now is it does EW of four negative one and the shape of

**[0:28:42]** this of course is four by 80. So that's what currently happens. And we instead want this

**[0:28:48]** to be a four by four by 20, where these consecutive 10 dimensional vectors get

**[0:28:52]** concatenated. So you know how when Python, you can take a list of range of 10.

**[0:28:59]** So we have numbers from zero to nine. And we can index like this to get all the even parts.

**[0:29:06]** And we can also index like starting at one and going in steps of two to get all the odd parts.

**[0:29:13]** So one way to implement this, it would be as follows. We can take E and we can index into

**[0:29:19]** it for all the batch elements. And then just even elements in this dimension. So at indexes zero,

**[0:29:26]** two, four and eight. And then all the parts here from this last dimension. And this gives us the

**[0:29:35]** even characters. And then here, this gives us all the odd characters. And basically what we

**[0:29:42]** want to do is we want to make sure that these get concatenated in PyTorch. And then we want

**[0:29:47]** to concatenate these two tensors along the second dimension. So this and the shape of it would be

**[0:29:55]** four by four by 20. This is definitely the result we want. We are explicitly grabbing the even parts

**[0:30:01]** and the odd parts. And we're arranging those four by four by 10 right next to each other and

**[0:30:06]** concatenate. So this works. But it turns out that what also works is you can simply use

**[0:30:12]** view again and just request the right shape. And it just so happens that in this case, those

**[0:30:19]** vectors will again end up being arranged exactly the way we want. So in particular if we take E

**[0:30:24]** and we just view it as a four by four by 20, which is what we want, we can check that this is

**[0:30:29]** exactly equal to, but let me call this, this is the explicit concatenation I suppose.

**[0:30:36]** So explicit dot shape is four by four by 20. If you just view it as four by four by 20,

**[0:30:42]** you can check that when you compare to explicit, you got a big, this is element wise operation.

**[0:30:48]** So making sure that all of them are true, evaluates to true. So basically long story short,

**[0:30:54]** we don't need to make an explicit call to concatenate, etc. We can simply take this

**[0:31:00]** input tensor to flatten and we can just view it in whatever way we want.

**[0:31:04]** And in particular, we don't want to stretch things out with negative one. We want to

**[0:31:09]** actually create a three dimensional array. And depending on how many vectors that are consecutive,

**[0:31:15]** we want to fuse, like for example, two, then we can just simply ask for this dimension to be 20.

**[0:31:22]** And use the negative one here. And PyTorch will figure out how many groups it needs to pack into

**[0:31:28]** this additional batch dimension. So let's now go into flatten and implement this. Okay,

**[0:31:33]** so I scrolled up here to flatten. And what we'd like to do is we'd like to

**[0:31:37]** change it now. So let me create a constructor and take the number of elements that are consecutive

**[0:31:42]** that we would like to concatenate now in the last dimension of the output. So here,

**[0:31:47]** we're just going to remember, solve that n equals n. And then I want to be careful here

**[0:31:52]** because PyTorch actually has a torched up flatten and its keyword arguments are different and they

**[0:31:57]** kind of like function differently. So our flatten is going to start to depart from PyTorch flatten.

**[0:32:02]** So let me call it flatten consecutive or something like that, just to make sure that our

**[0:32:07]** APIs are about equal. So this basically flattens only some n consecutive elements and puts them into

**[0:32:15]** the last dimension. Now here, the shape of x is b by t by c. So let me pop those out into

**[0:32:24]** variables. And recall that in our example down below, b was four, t was eight, and c was 10.

**[0:32:33]** Now instead of doing x dot view of b by negative one,

**[0:32:39]** right, this is what we had before, we want this to be b by negative one by,

**[0:32:49]** and basically here we want c times n. That's how many consecutive elements we want.

**[0:32:56]** And here instead of negative one, I don't super love the use of negative one because

**[0:33:00]** I like to be very explicit so that you get error messages when things don't go according to your

**[0:33:04]** expectation. So what do we expect here? We expect this to become t divide and using integer division

**[0:33:11]** here. So that's what I expect to happen. And then one more thing I want to do here is remember

**[0:33:17]** previously all the way in the beginning, n was three, and basically we're concatenating

**[0:33:23]** all the three characters that existed there. So we basically are concatenated everything.

**[0:33:29]** And so sometimes I can create a spurious dimension of one here. So if it is the case

**[0:33:34]** that x dot shape at one is one, then it's kind of like a spurious dimension.

**[0:33:39]** So we don't want to return a three-dimensional tensor with a one here. We just want to return

**[0:33:45]** a two-dimensional tensor exactly as we did before. So in this case, basically we will just say

**[0:33:50]** x equals x dot squeeze that is a pytorch function. And squeeze takes a dimension that

**[0:34:00]** it either squeezes out all the dimensions of a tensor that are one, or you can specify the

**[0:34:05]** exact dimension that you want to be squeezed. And again, I like to be as explicit as possible always.

**[0:34:12]** So I expect to squeeze out the first dimension only of this tensor, this three-dimensional tensor.

**[0:34:18]** And if this dimension here is one, then I just want to return b by c times n.

**[0:34:24]** And so self dot out will be x. And then we return self dot out. So that's the candidate

**[0:34:30]** implementation. And of course, this should be self dot in instead of just n. So let's run.

**[0:34:36]** And let's come here now and take it for a spin. So flatten consecutive. And in the beginning,

**[0:34:46]** let's just use eight. So this should recover the previous behavior. So flatten consecutive of

**[0:34:51]** eight, which is the current block size. That should recover the previous behavior. So we

**[0:35:00]** should be able to run the model. And here we can inspect, I have a little code snippet here,

**[0:35:06]** where I iterate over all the layers. I print the name of this class and the shape. And so

**[0:35:15]** we see the shapes as we expect them after every single layer in its output. So now

**[0:35:21]** let's try to restructure it using our flatten consecutive and do it hierarchically. So in particular,

**[0:35:28]** we want to flatten consecutive, not just block size, but just two. And then we want to process

**[0:35:34]** this with linear. Now the number of inputs to this linear will not be n embed times block size.

**[0:35:39]** It will now only be n embed times 20. This goes through the first layer. And now we can,

**[0:35:47]** in principle, just copy paste this. Now the next linear layer should expect n hidden times two.

**[0:35:53]** And the last piece of it should expect n hidden times two again. So this is sort of like the

**[0:36:02]** naive version of it. So running this, we now have a much, much bigger model. And we should be

**[0:36:09]** able to basically just forward the model. And now we can inspect the numbers in between. So 4x20

**[0:36:19]** was flattened consecutively into 4x4x20. This was projected into 4x4x200.

**[0:36:26]** And then Bashorm just worked out of the box. And we have to verify that Bashorm does the

**[0:36:31]** correct thing even though it takes three dimensional impedance instead of two dimensional

**[0:36:34]** input. Then we have 10H, which is element-wise. Then we crushed it again. So we flattened

**[0:36:41]** consecutively and ended up with a 4x2x400 now. Then linear brought it back down to 200, Bashorm

**[0:36:47]** 10H. And lastly, we get a 4x400. And we see that the flattened consecutive for the last

**[0:36:53]** flatten here, it squeezed out that dimension of one. So we only ended up with 4x400. And then

**[0:36:59]** linear Bashorm 10H and the last linear layer to get our logits. And so the logits end up in the

**[0:37:06]** same shape as they were before. But now we actually have a nice three-layer neural net. And it basically

**[0:37:12]** corresponds to, oops, sorry, it basically corresponds exactly to this network now except

**[0:37:18]** only this piece here because we only have three layers. Whereas here in this example, there's

**[0:37:23]** four layers with a total receptive field size of 16 characters instead of just eight characters.

**[0:37:30]** So the block size here is 16. So this piece of it is basically implemented here.

**[0:37:36]** Now we just have to kind of figure out some good channel numbers to use here. Now in particular,

**[0:37:42]** I changed the number of hidden units to be 68 in this architecture because when I use 68,

**[0:37:47]** the number of parameters comes out to be 22,000. So that's exactly the same that we had before.

**[0:37:52]** And we have the same amount of capacity at this neural net in terms of the number of parameters.

**[0:37:57]** But the question is whether we are utilizing those parameters in a more efficient architecture.

**[0:38:01]** So what I did then is I got rid of a lot of the debugging cells here and we ran the optimization

**[0:38:07]** and scrolling down to the result. We see that we get the identical performance roughly.

**[0:38:12]** So our validation loss now is 2.029 and previously it was 2.027. So controlling for

**[0:38:18]** number of parameters changing from the flat to hierarchical is not giving us anything yet.

**[0:38:23]** That said, there are two things to point out. Number one, we didn't really torture the architecture

**[0:38:29]** here very much. This is just my first guess. And there's a bunch of hyperparameters searched

**[0:38:33]** that we could do in order in terms of how we allocate our budget of parameters to what layers.

**[0:38:39]** Number two, we still may have a bug inside the bachelor 1d layer. So let's take a look at

**[0:38:45]** that because it runs but doesn't do the right thing. So I pulled up the

**[0:38:52]** layer inspector sort of that we have here and printed out the shape along the way.

**[0:38:56]** And currently it looks like the bachelor is receiving an input that is 32 by 4 by 68.

**[0:39:02]** And here on the right I have the current implementation of bachelor that we have right

**[0:39:05]** now. Now this bachelor assumed in the way we wrote it and at the time that x is two

**[0:39:11]** dimensional. So it was n by d where n was the back size. So that's why we only reduced the mean

**[0:39:18]** and the variance over the 0th dimension. But now x will basically become three dimensional.

**[0:39:23]** So what's happening inside the bachelor 1d layer right now and how come it's working at all

**[0:39:26]** and not giving any errors. The reason for that is basically because everything broadcasts

**[0:39:30]** properly but the bachelor is not doing what we want it to do. So in particular let's basically

**[0:39:37]** think through what's happening inside the bachelor. Looking at what's happening here.

**[0:39:43]** I have the code here. So we're receiving an input of 32 by 4 by 68 and then we are doing

**[0:39:51]** here x dot mean here I have e instead of x. But we're doing the mean over 0

**[0:39:57]** and that's actually giving us 1 by 4 by 68. So we're doing the mean only over the very first

**[0:40:01]** dimension and it's giving us a mean and a variance that still maintain this dimension here.

**[0:40:07]** So these means are only taken over 32 numbers in the first dimension and then when we perform this

**[0:40:14]** everything broadcasts correctly still. But basically what ends up happening is

**[0:40:20]** when we also look at the running mean the shape of it. So I'm looking at the model that layers

**[0:40:28]** at 3 which is the first bachelor layer and then looking at whatever the running mean

**[0:40:31]** became and its shape. The shape of this running mean now is 1 by 4 by 68.

**[0:40:37]** Instead of it being just a size of dimension because we have 68 channels we expect to have

**[0:40:45]** 68 means and variances that we're maintaining. But actually we have an array of 4 by 68 and

**[0:40:51]** so basically what this is telling us is this bachelor is only this bachelor is currently

**[0:40:56]** working in parallel over 4 times 68 instead of just 68 channels. So basically we are maintaining

**[0:41:08]** statistics for every one of these 4 positions individually and independently. And instead

**[0:41:14]** what we want to do is we want to treat this 4 as a batch dimension just like the 0th dimension.

**[0:41:19]** So as far as the batch norm is concerned it doesn't want to average we don't want to average

**[0:41:25]** over 32 numbers we want to now average over 32 times 4 numbers for every single one of these

**[0:41:30]** 68 channels. And so let me now remove this. It turns out that when you look at the documentation

**[0:41:38]** of tors.min so let's go to tors.min in one of its signatures when we specify the dimension

**[0:41:53]** we see that the dimension here is not it can be int or it can also be a tuple of ints

**[0:41:58]** so we can reduce over multiple integers at the same time over multiple dimensions at the same time.

**[0:42:03]** So instead of just reducing over zero we can pass in a tuple zero one and here zero one as well.

**[0:42:10]** And then what's going to happen is the output of course is going to be the same

**[0:42:13]** but now what's going to happen is because we reduce over zero and one

**[0:42:17]** if we look at in mean that shape we see that now we've reduced we took the mean over

**[0:42:23]** both the zero and the first dimension so we're just getting 68 numbers and a bunch of spurious

**[0:42:29]** dimensions here so now this becomes one by one by 68 and the running mean and the running variance

**[0:42:35]** analogously will become one by one by 68 so even though there are the spurious dimensions

**[0:42:40]** the current the correct thing will happen in that we are only maintaining means and variances

**[0:42:46]** for 64 sorry for 68 channels and we're now calculating the mean variance across 32 times

**[0:42:52]** four dimensions so that's exactly what we want and let's change the implementation of bachelor

**[0:42:58]** and 1d that we have so that it can take in two-dimensional or three-dimensional inputs

**[0:43:03]** and perform accordingly so at the end of the day the fix is relatively straightforward

**[0:43:07]** basically the dimension we want to reduce over is either zero or the tuple zero and one

**[0:43:13]** depending on the dimensionality of x so if x dot end in is two so it's a two-dimensional

**[0:43:18]** tensor then the dimension we want to reduce over is just the integer zero elif x dot and then miss

**[0:43:23]** three so it's a three-dimensional tensor then the dims we're going to assume are zero and one

**[0:43:29]** that we want to reduce over and then here we just pass in dim and if the dimensionality

**[0:43:34]** of x is anything else we'll now get an error which is good so that should be the fix now i

**[0:43:40]** want to point out one more thing we're actually departing from the api of pytorch here a little

**[0:43:45]** bit because when you come to bachelor and 1d pytorch you can scroll down and you can see

**[0:43:49]** that the input to this layer can either be n by c where n is the back size and c is the number of

**[0:43:55]** features or channels or it actually does accept three-dimensional inputs but it expects it to be

**[0:44:00]** n by c by l where l is say like the sequence length or something like that so um this is

**[0:44:08]** problem because you see how c is nested here in the middle and so when it gets three-dimensional

**[0:44:13]** inputs this bachelor layer will reduce over zero and two instead of zero and one so basically pytorch

**[0:44:21]** bachelor and 1d layer assumes that c will always be the first dimension whereas we all we assume here

**[0:44:28]** that c is the last dimension and there are some number of batch dimensions beforehand

**[0:44:34]** and so it expects n by c or m by c by l we expect m by c or n by l by c

**[0:44:41]** and so it's a deviation um i think it's okay i prefer it this way honestly so this is the way

**[0:44:49]** that we will keep it for our purposes so i redefine the layers re-initialize the neural

**[0:44:54]** nut and did a single forward pass with a break just for one step looking at the shapes along the way

**[0:44:59]** they're of course identical all the shapes are the same by the way we see that things are

**[0:45:03]** actually working as we want them to now is that when we look at the bachelor layer the

**[0:45:08]** running mean shape is now one by one by 68 so we're only maintaining 68 means for every one of our

**[0:45:13]** channels and we're treating both the zeroth and the first dimension as a batch dimension

**[0:45:18]** which is exactly what we want so let me retrain the neural net now okay so i retrained the neural

**[0:45:22]** net with the bug fix we get a nice curve and when we look at the validation performance we do

**[0:45:26]** actually see a slight improvement so it went from 2.029 to 2.022 so basically the bug inside

**[0:45:32]** the bathroom was holding us back like a little bit it looks like and we are getting a tiny improvement

**[0:45:38]** now but it's not clear if this is statistically significant um and the reason we slightly expect

**[0:45:44]** an improvement is because we're not maintaining so many different means and variances that are

**[0:45:48]** only estimated using using 32 numbers effectively now we are estimating them using 32 times four

**[0:45:54]** numbers so you just have a lot more numbers that go into any one estimate of the mean and

**[0:45:58]** variance and it allows things to be a bit more stable and less wiggly inside those estimates of

**[0:46:04]** those statistics so pretty nice with this more general architecture in place we are now set up to

**[0:46:10]** push the performance further by increasing the size of the network so for example i bumped up the

**[0:46:15]** number of embeddings to 24 instead of 10 and also increased number of hidden units but using

**[0:46:21]** the exact same architecture we now have 76 000 parameters and the training takes a lot longer

**[0:46:27]** but we do get a nice curve and then when you actually evaluate the performance

**[0:46:30]** we are now getting validation performance of 1.993 so we've crossed over the 2.0

**[0:46:36]** sort of territory and we're at about 1.99 but we are starting to have to wait quite a bit longer

**[0:46:42]** and we're a little bit in the dark with respect to the correct setting of the hyper

**[0:46:46]** parameters here and the learning rates and so on because the experiments are starting to

**[0:46:49]** take longer to train and so we are missing sort of like an experimental harness on which

**[0:46:54]** we could run a number of experiments and really tune this architecture very well

**[0:46:58]** so i'd like to conclude now with a few notes we basically improved our performance from

**[0:47:02]** a starting of 2.1 down to 1.9 but i don't want that to be the focus because honestly we're

**[0:47:07]** kind of in the dark we have no experimental harness we're just guessing and checking

**[0:47:11]** and this whole thing is terrible we're just looking at the training loss normally you

**[0:47:15]** want to look at both the training and the validation loss together the whole thing

**[0:47:19]** looks different if you're actually trying to squeeze out numbers that said we did implement

**[0:47:25]** this architecture from the wait net paper but we did not implement this specific forward pass of it

**[0:47:32]** where you have a more complicated linear layer sort of that is this gated linear layer kind of

**[0:47:38]** and there's residual connections and skip connections and so on so we did not implement

**[0:47:42]** that we just implemented this structure i would like to briefly hint or preview

**[0:47:47]** how what we've done here relates to convolutional neural networks as used in the wait net paper

**[0:47:52]** and basically the use of convolutions is strictly for efficiency it doesn't actually

**[0:47:56]** change the model we've implemented so here for example let me look at a specific name to work

**[0:48:02]** with an example so there's a name in our training set and it's deondre and it has seven letters

**[0:48:08]** so that is eight independent examples in our model so all these rows here are independent

**[0:48:14]** examples of deondre now you can forward of course any one of these rows independently so i can take

**[0:48:20]** my model and call call it on any individual index notice by the way here i'm being a little bit tricky

**[0:48:28]** the reason for this is that extra at seven dot shape is just one dimensional array of eight

**[0:48:35]** so you can't actually call the model on it you're going to get an error because there's no batch

**[0:48:40]** dimension so when you do extra at um list of seven then the shape of this becomes one by eight so I

**[0:48:49]** get an extra batch dimension of one and then we can forward the model so that forwards a single

**[0:48:56]** example and you might imagine that you actually may want to forward all of these eight um at the

**[0:49:01]** same time so pre-allocating some memory and then doing a for loop eight times and forwarding

**[0:49:07]** all of those eight here will give us all the logits in all these different cases

**[0:49:13]** now for us with the model as we've implemented it right now this is eight independent calls to our

**[0:49:17]** model but what convolutions allow you to do is it allow you to basically slide this model efficiently

**[0:49:23]** over the input sequence and so this for loop can be done not outside in python but inside

**[0:49:30]** of kernels in kuda and so this for loop gets hidden into the convolution so the convolution

**[0:49:36]** basically you can think of it as it's a for loop applying a little linear filter over space of some

**[0:49:42]** input sequence and in our case the space we're interested in is one dimensional and we're

**[0:49:46]** interested in sliding these filters over the input data so this diagram actually is fairly

**[0:49:54]** good as well basically what we've done is here they are highlighting in black one individual

**[0:49:59]** one single sort of like tree of this calculation so just calculating the single output example

**[0:50:04]** here um and so this is basically what we've implemented here we've implemented a single

**[0:50:11]** this black structure we've implemented that and calculated a single output like a single example

**[0:50:17]** but what convolutions allow you to do is it allows you to take this black structure

**[0:50:21]** and kind of like slide it over the input sequence here and calculate all of these

**[0:50:27]** orange outputs at the same time or here that corresponds to calculating all of these

**[0:50:32]** outputs off at all the positions of the andre at the same time and the reason that this is

**[0:50:40]** much more efficient is because number one as i mentioned the for loop is inside the kuda kernels

**[0:50:45]** in the sliding so that makes it efficient but number two notice the variable reuse here

**[0:50:51]** for example if we look at this circle this node here this node here is the right child of this

**[0:50:56]** node but it's also the left child of the node here and so basically this node and its value

**[0:51:03]** is used twice and so right now in this naive way we'd have to recalculate it but here we are allowed

**[0:51:11]** to reuse it so in the convolutional neural network you think of these linear layers that we have

**[0:51:16]** up above as filters and we take these filters and they're linear filters and you slide them

**[0:51:22]** over input sequence and we calculate the first layer and then the second layer and then third layer

**[0:51:27]** and then the output layer of the sandwich and it's all done very efficiently using these convolutions

**[0:51:32]** so we're going to cover that in a future video the second thing i hope you took away from this video

**[0:51:36]** is you've seen me basically implement all of these um layer lego building blocks or module

**[0:51:42]** building blocks and i'm implementing them over here and we've implemented a number of layers

**[0:51:46]** together and we've also implementing these these containers and we've overall pytorchified our

**[0:51:52]** code quite a bit more now basically what we're doing here is we're re-implementing torche.nn

**[0:51:58]** which is the neural networks um library on top of torche.tensor and it looks very much like this

**[0:52:04]** except it is much better because it's because it's in pytorch instead of jinkling my jupyter

**[0:52:10]** notebook so i think going forward i will probably have considered us having unlocked torche.nn

**[0:52:16]** we understand roughly what's in there how these modules work how they're nested

**[0:52:20]** and what they're doing on top of torche.tensor so hopefully we're just uh we'll just switch

**[0:52:25]** over and continue and start using torche.nn directly the next thing i hope you got a bit of

**[0:52:29]** a sense of is what the development process of building deep neural networks looks like

**[0:52:34]** which i think was relatively representative to some extent so number one we are spending

**[0:52:39]** a lot of time in the documentation page of pytorch and we're reading through all the

**[0:52:43]** layers looking at the documentations what are the shapes of the inputs what can they be

**[0:52:48]** what does the layer do and so on unfortunately i have to say the pytorch documentation is not

**[0:52:54]** very good they spend a ton of time on hardcore engineering of all kinds of distributed

**[0:52:59]** primitives etc but as far as i can tell no one is maintaining documentation it will lie to you

**[0:53:05]** it will be wrong it will be incomplete it will be unclear so unfortunately it is what it is

**[0:53:12]** and you just kind of do your best with what they've given us number two

**[0:53:20]** the other thing that i hope you got a sense of is there's a ton of trying to make

**[0:53:25]** the shapes work and there's a lot of gymnastics around these multi-dimensional arrays

**[0:53:28]** and are they two-dimensional three-dimensional four-dimensional what layers take what shapes

**[0:53:33]** is it ncl or nlc and you're permuting and viewing and it just can get pretty messy

**[0:53:40]** and so that brings me to number three i very often prototype these layers and implementations

**[0:53:44]** in jupyret notebooks and make sure that all the shapes work out and i'm spending a lot of time

**[0:53:49]** basically babysitting the shapes and making sure everything is correct and then once i'm

**[0:53:53]** satisfied with the functionality in a jupyret notebook i will take that code and copy paste

**[0:53:57]** it into my repository of actual code that i'm training with and so then i'm working with

**[0:54:02]** vs code on the side so i usually have jupyret notebook and vs code i develop a jupyret

**[0:54:07]** notebook i paste into vs code and then i kick off experiments from from the repo of course

**[0:54:11]** from the code repository so that's roughly some notes on the development process of working

**[0:54:17]** with neural nets lastly i think this lecture unlocks a lot of potential further lectures

**[0:54:21]** because number one we have to convert our neural network to actually use these

**[0:54:25]** dilated causal convolutional layers so implement in the comnet number two i'm

**[0:54:31]** potentially starting to get into what this means where are residual connections

**[0:54:35]** and skip connections and why are they useful uh number three we as i mentioned we don't have

**[0:54:40]** any experimental harness so right now i'm just guessing checking everything this is not representative

**[0:54:45]** of typical deep learning workflows you have to set up your evaluation harness you can kick

**[0:54:50]** off experiments you have lots of arguments that your script can take you're you're kicking

**[0:54:54]** off a lot of experimentation you're looking at a lot of plots of training and validation

**[0:54:57]** losses and you're looking at what is working and what is not working and you're working on

**[0:55:01]** this like population level and you're doing all these hyper parameter searches and so we've

**[0:55:05]** done none of that so far um so how to set that up and how to make it good i think it's a whole

**[0:55:12]** another uh topic and number three we should probably cover recurrent neural networks

**[0:55:16]** harness lstm's grooves and of course transformers uh so many uh places to go uh and we'll

**[0:55:23]** cover that in the future for now sorry i forgot to say that if you are interested

**[0:55:29]** i think it is kind of interesting to try to beat this number 1.993 because i really haven't

**[0:55:34]** tried a lot of experimentation here and there's quite a bit of longing for it potentially

**[0:55:38]** to still persist further so i haven't tried any other ways of allocating these channels

**[0:55:43]** in this neural net maybe the number of dimensions for the embedding is all wrong

**[0:55:48]** maybe it's possible to actually take the original network with just one hidden layer

**[0:55:52]** and make it big enough and actually beat my fancy hierarchical uh network it's not obvious

**[0:55:57]** that would be kind of embarrassing if this did not do better even once you torture it a little bit

**[0:56:02]** maybe you can read the way in that paper and try to figure out how some of these layers work

**[0:56:05]** and implement them yourselves using what we have uh and of course you can always tune some of the

**[0:56:10]** initialization or some of the optimization and see if you can improve it that way

**[0:56:15]** so i'd be curious if people can come up with some ways to beat this um and yeah that's it for now

**[0:56:20]** bye

