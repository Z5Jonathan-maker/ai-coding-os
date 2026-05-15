---
source: "https://www.youtube.com/watch?v=P6sfmUTpUmc"
kind: video
title: "Building makemore Part 3: Activations & Gradients, BatchNorm"
retrieved: "2026-05-04T06:08:54+00:00"
word_count: 24144
char_count: 160100
source_url: "https://www.youtube.com/watch?v=P6sfmUTpUmc"
---

# Building makemore Part 3: Activations & Gradients, BatchNorm

# Building makemore Part 3: Activations & Gradients, BatchNorm

- **Source:** https://www.youtube.com/watch?v=P6sfmUTpUmc
- **Uploader:** Andrej Karpathy
- **Duration:** 1:55:57

## Description

We dive into some of the internals of MLPs with multiple layers and scrutinize the statistics of the forward pass activations, backward pass gradients, and some of the pitfalls when they are improperly scaled. We also look at the typical diagnostic tools and visualizations you'd want to use to understand the health of your deep network. We learn why training deep neural nets can be fragile and introduce the first modern innovation that made doing so much easier: Batch Normalization. Residual connections and the Adam optimizer remain notable todos for later video.

Links:
- makemore on github: https://github.com/karpathy/makemore
- jupyter notebook I built in this video: https://github.com/karpathy/nn-zero-to-hero/blob/master/lectures/makemore/makemore_part3_bn.ipynb
- collab notebook: https://colab.research.google.com/drive/1H5CSy-OnisagUgDUXhHwo1ng2pjKHYSN?usp=sharing
- my website: https://karpathy.ai
- my twitter: https://twitter.com/karpathy
- Discord channel: https://discord.gg/3zy8kqD9Cp

Useful links:
- "Kaiming init" paper: https://arxiv.org/abs/1502.01852
- BatchNorm paper: https://arxiv.org/abs/1502.03167
- Bengio et al. 2003 MLP language model paper (pdf): https://www.jmlr.org/papers/volume3/bengio03a/bengio03a.pdf
- Good paper illustrating some of the problems with batchnorm in practice: https://arxiv.org/abs/2105.07576

Exercises:
- E01: I did not get around to seeing what happens when you initialize all weights and biases to zero. Try this and train the neural net. You might think either that 1) the network trains just fine or 2) the network doesn't train at all, but actually it is 3) the network trains but only partially, and achieves a pretty bad final performance. Inspect the gradients and activations to figure out what is happening and why the network is only partially training, and what part is being trained exactly.
- E02: BatchNorm, unlike other normalization layers like LayerNorm/GroupNorm etc. has the big advantage that after training, the batchnorm gamma/beta can be "folded into" the weights of the preceeding Linear layers, effectively erasing the need to forward it at test time. Set up a small 3-layer MLP with batchnorms, train the network, then "fold" the batchnorm gamma/beta into the preceeding Linear layer's W,b by creating a new W2, b2 and erasing the batch norm. Verify that this gives the same forward pass during inference. i.e. we see that the batchnorm is there just for stabilizing the training, and can be thrown out after training is done! pretty cool.

Chapters:
00:00:00 intro
00:01:22 starter code
00:04:19 fixing the initial loss 
00:12:59 fixing the saturated tanh
00:27:53 calculating the init scale: “Kaiming init”
00:40:40 batch normalization
01:03:07 batch normalization: summary
01:04:50 real example: resnet50 walkthrough
01:14:10 summary of the lecture
01:18:35 just kidding: part2: PyTorch-ifying the code
01:26:51 viz #1: forward pass activations statistics
01:30:54 viz #2: backward pass gradient statistics
01:32:07 the fully linear case of no non-linearities
01:36:15 viz #3: parameter activation and gradient statistics
01:39:55 viz #4: update:data ratio over time
01:46:04 bringing back batchnorm, looking at the visualizations
01:51:34 summary of the lecture for real this time

## Transcript

**[0:00:00]** Hi everyone.

**[0:00:01]** Today we are continuing our implementation of Make More.

**[0:00:04]** Now in the last lecture,

**[0:00:05]** we implemented the multi-layer perceptron

**[0:00:06]** along the lines of Benjio et al. 2003

**[0:00:08]** for character level language modeling.

**[0:00:10]** So we followed this paper,

**[0:00:12]** took in a few characters in the past,

**[0:00:14]** and used an MLP to predict the next character in a sequence.

**[0:00:17]** So what we'd like to do now

**[0:00:18]** is we'd like to move on to more complex

**[0:00:19]** and larger neural networks,

**[0:00:21]** like recurrent neural networks,

**[0:00:22]** and their variations like the GRU, LSTM, and so on.

**[0:00:26]** Now, before we do that though,

**[0:00:27]** we have to stick around the level

**[0:00:29]** of multi-layer perceptron for a bit longer.

**[0:00:31]** And I'd like to do this because I would like us

**[0:00:33]** to have a very good intuitive understanding

**[0:00:35]** of the activations in the neural net during training,

**[0:00:38]** and especially the gradients that are flowing backwards

**[0:00:40]** and how they behave and what they look like.

**[0:00:43]** And this is going to be very important

**[0:00:44]** to understand the history of the development

**[0:00:46]** of these architectures,

**[0:00:48]** because we'll see that recurrent neural networks,

**[0:00:49]** while they are very expressive

**[0:00:52]** in that they are a universal approximator

**[0:00:53]** and can in principle implement all the algorithms,

**[0:00:57]** we'll see that they are not very easily optimizable

**[0:01:00]** with the first-order gradient-based techniques

**[0:01:02]** that we have available to us and that we use all the time.

**[0:01:04]** And the key to understanding

**[0:01:06]** why they are not optimizable easily

**[0:01:08]** is to understand the activations and the gradients

**[0:01:11]** and how they behave during training.

**[0:01:12]** And we'll see that a lot of the variants

**[0:01:14]** since recurrent neural networks

**[0:01:16]** have tried to improve that situation.

**[0:01:19]** And so that's the path that we have to take,

**[0:01:21]** and let's go start it.

**[0:01:22]** So the starting code for this lecture

**[0:01:24]** is largely the code from before,

**[0:01:26]** but I've cleaned it up a little bit.

**[0:01:28]** So you'll see that we are importing

**[0:01:30]** all the Torch and Matplot web utilities.

**[0:01:33]** We're reading in the words just like before.

**[0:01:35]** These are eight example words.

**[0:01:37]** There's a total of 32,000 of them.

**[0:01:39]** Here's a vocabulary of all the lowercase letters

**[0:01:41]** and the special dot token.

**[0:01:44]** Here we are reading the dataset and processing it

**[0:01:47]** and creating three splits,

**[0:01:50]** the train, dev and the test split.

**[0:01:53]** Now in the MLP, this is the identical same MLP,

**[0:01:56]** except you see that I've removed

**[0:01:57]** a bunch of magic numbers that we had here.

**[0:01:59]** And instead we have the dimensionality

**[0:02:01]** of the embedding space of the characters

**[0:02:03]** and the number of hidden units in the hidden layer.

**[0:02:06]** And so I've pulled them outside here

**[0:02:07]** so that we don't have to go

**[0:02:09]** and change all these magic numbers all the time.

**[0:02:11]** With the same neural net with 11,000 parameters

**[0:02:14]** that we optimize now over 200,000 steps

**[0:02:16]** with batch size of 32.

**[0:02:18]** And you see that I've refactored the code here

**[0:02:21]** a little bit, but there are no functional changes.

**[0:02:23]** I just created a few extra variables,

**[0:02:25]** a few more comments and I removed all the magic numbers

**[0:02:29]** and otherwise it's the exact same thing.

**[0:02:32]** Then when we optimize,

**[0:02:32]** we saw that our loss looked something like this.

**[0:02:35]** We saw that the train and val loss

**[0:02:37]** were about 2.16 and so on.

**[0:02:41]** Here I refactored the code a little bit

**[0:02:44]** for the evaluation of arbitrary splits.

**[0:02:47]** So you pass in the string

**[0:02:48]** of which split you'd like to evaluate.

**[0:02:50]** And then here, depending on train, val or test,

**[0:02:53]** I index in and I get the correct split.

**[0:02:55]** And then this is the forward pass of the network

**[0:02:57]** and evaluation of the loss and printing it.

**[0:03:00]** So just making it nicer.

**[0:03:02]** One thing that you'll notice here is

**[0:03:05]** I'm using a decorator torch.nograd

**[0:03:07]** which you can also look up and read documentation of.

**[0:03:11]** Basically what this decorator does on top of a function

**[0:03:14]** is that whatever happens in this function

**[0:03:17]** is assumed by torch to never require any gradients.

**[0:03:22]** So it will not do any of the bookkeeping

**[0:03:24]** that it does to keep track of all the gradients

**[0:03:26]** in anticipation of an eventual backward pass.

**[0:03:29]** It's almost as if all the tensors that get created here

**[0:03:31]** have a requires grad of false.

**[0:03:34]** And so it just makes everything much more efficient

**[0:03:36]** because you're telling torch that I will not call dot backward

**[0:03:39]** on any of this computation

**[0:03:40]** and you don't need to maintain the graph under the hood.

**[0:03:43]** So that's what this does.

**[0:03:45]** And you can also use a context manager

**[0:03:48]** with torch.nograd and you can look those up.

**[0:03:53]** Then here we have the sampling from a model.

**[0:03:55]** Just as before, just a four passive neural net

**[0:03:58]** getting the distribution, sampling from it,

**[0:04:00]** adjusting the context window

**[0:04:02]** and repeating until we get the special end token.

**[0:04:04]** And we see that we are starting to get much nicer looking

**[0:04:07]** words sample from the model.

**[0:04:09]** It's still not amazing

**[0:04:11]** and they're still not fully named like

**[0:04:13]** but it's much better than what we had

**[0:04:14]** with the bi-gram model.

**[0:04:17]** So that's our starting point.

**[0:04:19]** Now the first thing I would like to scrutinize

**[0:04:20]** is the initialization.

**[0:04:22]** I can tell that our network

**[0:04:24]** is very improperly configured at initialization

**[0:04:27]** and there's multiple things wrong with it

**[0:04:29]** but let's just start with the first one.

**[0:04:31]** Look here on the zeroth iteration,

**[0:04:32]** the very first iteration,

**[0:04:34]** we are recording a loss of 27

**[0:04:37]** and this rapidly comes down to roughly one or two or so.

**[0:04:40]** So I can tell that the initialization is almost up

**[0:04:42]** because this is way too high.

**[0:04:44]** In training of neural nets,

**[0:04:45]** it is almost always the case

**[0:04:46]** that you will have a rough idea

**[0:04:48]** for what loss to expect at initialization.

**[0:04:50]** And that just depends on the loss function

**[0:04:52]** and the problem set up.

**[0:04:54]** In this case, I do not expect 27.

**[0:04:57]** I expect a much lower number

**[0:04:58]** and we can calculate it together.

**[0:05:00]** Basically at initialization,

**[0:05:02]** what we'd like is that there's 27 characters

**[0:05:06]** that could come next for any one training example.

**[0:05:09]** At initialization,

**[0:05:10]** we have no reason to believe any characters

**[0:05:11]** to be much more likely than others.

**[0:05:13]** And so we'd expect that the probability distribution

**[0:05:15]** that comes out initially

**[0:05:17]** is a uniform distribution

**[0:05:19]** assigning about equal probability

**[0:05:20]** to all the 27 characters.

**[0:05:23]** So basically what we'd like

**[0:05:24]** is the probability for any character

**[0:05:27]** would be roughly one over 27.

**[0:05:32]** That is the probability we should record

**[0:05:33]** and then the loss is the negative log probability.

**[0:05:36]** So let's wrap this in a tensor

**[0:05:39]** and then that one can take the log of it

**[0:05:42]** and then the negative log probability

**[0:05:44]** is the loss we would expect,

**[0:05:45]** which is 3.29, much, much lower than 27.

**[0:05:49]** And so what's happening right now

**[0:05:51]** is that at initialization,

**[0:05:52]** the neural net is creating probability distributions

**[0:05:55]** that are almost up.

**[0:05:56]** Some characters are very confident

**[0:05:58]** and some characters are very not confident.

**[0:06:00]** And then basically what's happening

**[0:06:01]** is that the network is very confidently wrong

**[0:06:05]** and that's what makes it record very high loss.

**[0:06:10]** So here's a smaller four dimensional example

**[0:06:12]** of the issue.

**[0:06:13]** Let's say we only have four characters

**[0:06:16]** and then we have logits that come out of the neural net

**[0:06:18]** and they are very, very close to zero.

**[0:06:20]** Then when we take the softmax of all zeros,

**[0:06:23]** we get probabilities there are a diffuse distribution.

**[0:06:27]** So sums to one and is exactly uniform.

**[0:06:31]** And then in this case, if the label is say two,

**[0:06:33]** it doesn't actually matter if the label is two

**[0:06:36]** or three or one or zero

**[0:06:38]** because it's a uniform distribution,

**[0:06:39]** we're recording the exact same loss, in this case 1.38.

**[0:06:43]** So this is the loss we would expect

**[0:06:44]** for a four dimensional example.

**[0:06:46]** And I can see of course that

**[0:06:47]** as we start to manipulate these logits,

**[0:06:50]** we're going to be changing the loss here.

**[0:06:52]** So it could be that we lock out and by chance,

**[0:06:55]** this could be a very high number

**[0:06:57]** like five or something like that.

**[0:06:59]** Then in that case, we'll record a very low loss

**[0:07:01]** because we're assigning the correct probability

**[0:07:02]** at initialization by chance to the correct label.

**[0:07:06]** Much more likely it is

**[0:07:08]** that some other dimension will have a high logit

**[0:07:14]** and then what will happen is

**[0:07:14]** we start to record much higher loss.

**[0:07:17]** And what can come, what can happen is basically

**[0:07:19]** the logits come out like something like this,

**[0:07:21]** you know, and they take on extreme values

**[0:07:24]** and we record really high loss.

**[0:07:28]** For example, if we have torched up random of four,

**[0:07:31]** so these are uniform,

**[0:07:34]** so these are normally distributed numbers for them.

**[0:07:40]** And here we can also print the logits probabilities

**[0:07:44]** that come out of it and loss.

**[0:07:47]** And so because these logits are near zero,

**[0:07:50]** for the most part, the loss that comes out is okay.

**[0:07:53]** But suppose this is like times 10 now.

**[0:07:58]** You see how because these are more extreme values,

**[0:08:01]** it's very unlikely that you're going to be guessing

**[0:08:04]** the correct bucket and then you're confidently wrong

**[0:08:07]** and recording very high loss.

**[0:08:09]** If your logits are coming out even more extreme,

**[0:08:12]** you might get extremely,

**[0:08:14]** I'm saying loss is like infinity even at initialization.

**[0:08:20]** So basically this is not good and we want the logits

**[0:08:22]** to be roughly zero when the network is initialized.

**[0:08:27]** In fact, the logits don't have to be just zero,

**[0:08:30]** they just have to be equal.

**[0:08:31]** So for example, if all the logits are one,

**[0:08:34]** then because of the normalization inside the softmax,

**[0:08:36]** this will actually come out okay.

**[0:08:38]** But by symmetry, we don't want it to be

**[0:08:40]** any arbitrary positive or negative number,

**[0:08:42]** we just want it to be all zeros

**[0:08:43]** and record the loss that we expect at initialization.

**[0:08:46]** So let's not concretely see where things go wrong

**[0:08:48]** in our example.

**[0:08:49]** Here we have the initialization.

**[0:08:51]** Let me re-initialize the neural net.

**[0:08:53]** And here let me break after the very first iteration.

**[0:08:56]** So we only see the initial loss, which is 27.

**[0:09:00]** So that's way too high.

**[0:09:01]** And intuitively now we can expect the variables involved

**[0:09:04]** and we see that the logits here,

**[0:09:05]** if we just print some of these,

**[0:09:09]** if we just print the first row,

**[0:09:10]** we see that the logits take on quite extreme values

**[0:09:13]** and that's what's creating the fake confidence

**[0:09:16]** in incorrect answers and makes the loss

**[0:09:20]** get very, very high.

**[0:09:22]** So these logits should be much, much closer to zero.

**[0:09:25]** So now let's think through how we can achieve

**[0:09:27]** logits coming out of this neural net

**[0:09:29]** to be more closer to zero.

**[0:09:32]** You see here that logits are calculated

**[0:09:34]** as the hidden states multiplied by W2 plus B2.

**[0:09:37]** So first of all, currently we're initializing B2

**[0:09:40]** as random values of the right size.

**[0:09:44]** But because we want roughly zero,

**[0:09:46]** we don't actually want to be adding a bias of random numbers.

**[0:09:49]** So in fact, I'm going to add a times of zero here

**[0:09:51]** to make sure that B2 is just basically zero

**[0:09:55]** at initialization.

**[0:09:57]** And second, this is H multiplied by W2.

**[0:10:00]** So if we want logits to be very, very small,

**[0:10:03]** then we would be multiplying W2 and making that smaller.

**[0:10:07]** So for example, if we scale down W2 by 0.1,

**[0:10:09]** all the elements,

**[0:10:11]** then if I do again, just the very first iteration,

**[0:10:14]** you see that we are getting much closer to what we expect.

**[0:10:17]** So roughly what we want is about 3.29.

**[0:10:20]** This is 4.2.

**[0:10:22]** I can make this maybe even smaller, 3.32.

**[0:10:26]** Okay, so we're getting closer and closer.

**[0:10:28]** Now, you're probably wondering, can we just set this to zero?

**[0:10:33]** Then we get, of course,

**[0:10:34]** exactly what we're looking for at initialization.

**[0:10:38]** And the reason I don't usually do this

**[0:10:40]** is because I'm very nervous.

**[0:10:42]** And I'll show you in a second

**[0:10:43]** why you don't want to be setting Ws

**[0:10:46]** or weights of a neural net exactly to zero.

**[0:10:49]** You usually want it to be small numbers

**[0:10:51]** instead of exactly zero.

**[0:10:53]** For this output layer in this specific case,

**[0:10:55]** I think it would be fine,

**[0:10:57]** but I'll show you in a second

**[0:10:58]** where things go wrong very quickly if you do that.

**[0:11:00]** So let's just go with 0.01.

**[0:11:03]** In that case, our loss is close enough,

**[0:11:05]** but has some entropy.

**[0:11:06]** It's not exactly zero.

**[0:11:08]** It's got some low entropy,

**[0:11:10]** and that's used for symmetry breaking,

**[0:11:11]** as we'll see in a second.

**[0:11:13]** Logits are now coming out much closer to zero,

**[0:11:16]** and everything is well and good.

**[0:11:18]** So if I just erase these

**[0:11:21]** and I now take away the break statement,

**[0:11:25]** we can run the optimization

**[0:11:26]** with this new initialization.

**[0:11:28]** And let's just see what losses we record.

**[0:11:32]** Okay, so I'll let it run.

**[0:11:34]** And you see that we started off good,

**[0:11:35]** and then we came down a bit.

**[0:11:38]** The plot of the loss

**[0:11:39]** now doesn't have this hockey shape appearance,

**[0:11:43]** because basically what's happening in the hockey stick,

**[0:11:45]** the very first few iterations of the loss,

**[0:11:48]** what's happening during the optimization

**[0:11:50]** is the optimization is just squashing down the logits,

**[0:11:52]** and then it's rearranging the logits.

**[0:11:55]** So basically we took away this easy part

**[0:11:57]** of the loss function,

**[0:11:58]** where just the weights were just being shrunk down.

**[0:12:01]** And so therefore we don't get these easy gains

**[0:12:04]** in the beginning,

**[0:12:05]** and we're just getting some of the hard gains

**[0:12:07]** of training the actual neural net.

**[0:12:08]** And so there's no hockey stick appearance.

**[0:12:11]** So good things are happening in that both.

**[0:12:13]** Number one, loss initialization is what we expect.

**[0:12:17]** And the loss doesn't look like a hockey stick.

**[0:12:20]** And this is true for any neural net you might train

**[0:12:23]** and something to look out for.

**[0:12:25]** And second, the loss that came out

**[0:12:27]** is actually quite a bit improved.

**[0:12:29]** Unfortunately, I erased what we had here before.

**[0:12:31]** I believe this was 2.12,

**[0:12:35]** and this was 2.16.

**[0:12:37]** So we get a slightly improved result.

**[0:12:40]** And the reason for that is

**[0:12:41]** because we're spending more cycles, more time,

**[0:12:44]** optimizing the neural net actually,

**[0:12:46]** instead of just spending the first several thousand iterations

**[0:12:50]** probably just squashing down the weights

**[0:12:53]** because they are so way too high

**[0:12:54]** in the beginning of the initialization.

**[0:12:56]** So something to look out for, and that's number one.

**[0:13:00]** Now let's look at the second problem.

**[0:13:01]** Let me re-initialize our neural net

**[0:13:03]** and let me reintroduce the break statement.

**[0:13:06]** So we have a reasonable initial loss.

**[0:13:08]** So even though everything is looking good

**[0:13:09]** on the level of the loss

**[0:13:11]** and we get something that we expect,

**[0:13:12]** there's still a deeper problem lurking

**[0:13:14]** inside this neural net and its initialization.

**[0:13:17]** So the logits are now okay.

**[0:13:19]** The problem now is with the values of H,

**[0:13:23]** the activations of the hidden states.

**[0:13:25]** Now if we just visualize this vector,

**[0:13:27]** sorry, this tensor H,

**[0:13:29]** it's kind of hard to see,

**[0:13:29]** but the problem here roughly speaking

**[0:13:31]** is you see how many of the elements are one

**[0:13:34]** or negative one.

**[0:13:36]** Now recall that torch.10h,

**[0:13:38]** the 10h function is a squashing function.

**[0:13:40]** It takes arbitrary numbers

**[0:13:41]** and it squashes them into a range of negative one and one

**[0:13:44]** and it does so smoothly.

**[0:13:46]** So let's look at the histogram of H

**[0:13:47]** to get a better idea of the distribution

**[0:13:49]** of the values inside this tensor.

**[0:13:52]** We can do this first.

**[0:13:55]** Well, we can see that H is 32 examples

**[0:13:58]** and 200 activations in each example.

**[0:14:00]** We can view it as negative one

**[0:14:02]** to stretch it out into one large vector.

**[0:14:06]** And we can then call tool list

**[0:14:08]** to convert this into one large Python list of floats.

**[0:14:13]** And then we can pass this into PLT.hist for histogram

**[0:14:17]** and we say we want 50 bins

**[0:14:20]** and a semicolon to suppress a bunch of output we don't want.

**[0:14:24]** So we see this histogram

**[0:14:25]** and we see that most of the values by far

**[0:14:27]** take on value of negative one and one.

**[0:14:30]** So this 10h is very, very active.

**[0:14:33]** And we can also look at basically why that is.

**[0:14:37]** We can look at the pre-activations

**[0:14:39]** that feed into the 10h.

**[0:14:42]** And we can see that the distribution

**[0:14:44]** of the pre-activations is very, very broad.

**[0:14:47]** These take numbers between negative 15 and 15

**[0:14:50]** and that's why in a torch at 10h

**[0:14:52]** everything is being squashed and capped

**[0:14:53]** to be in the range of negative one and one

**[0:14:55]** and lots of numbers here take on very extreme values.

**[0:14:59]** Now if you are new to neural networks

**[0:15:01]** you might not actually see this as an issue

**[0:15:03]** but if you're well versed in the dark arts back propagation

**[0:15:06]** and then have an intuitive sense

**[0:15:07]** of how these gradients flow through in your own net

**[0:15:10]** you are looking at your distribution of 10h activations here

**[0:15:13]** and you are sweating.

**[0:15:14]** So let me show you why.

**[0:15:16]** We have to keep in mind that during back propagation

**[0:15:18]** just like we saw in micrograd

**[0:15:19]** we are doing backward pass starting at the loss

**[0:15:22]** and flowing through the network backwards.

**[0:15:24]** In particular, we're going to back propagate

**[0:15:26]** through this torch.10h.

**[0:15:28]** And this layer here is made up of 200 neurons

**[0:15:31]** for each one of these examples

**[0:15:33]** and it implements an element twice 10h.

**[0:15:36]** So let's look at what happens in 10h in the backward pass.

**[0:15:39]** We can actually go back to our previous micrograd code

**[0:15:43]** in the very first lecture

**[0:15:44]** and see how we implemented 10h.

**[0:15:46]** We saw that the input here was x

**[0:15:49]** and then we calculate t which is the 10h of x.

**[0:15:52]** So that's t and t is between negative one and one.

**[0:15:54]** It's the output of the 10h.

**[0:15:56]** And then in the backward pass

**[0:15:57]** how do we back propagate through a 10h?

**[0:16:00]** We take out that grad

**[0:16:02]** and then we multiply it.

**[0:16:04]** This is the chain rule with the local gradient

**[0:16:06]** which took the form of one minus t squared.

**[0:16:09]** So what happens if the outputs of your 10h

**[0:16:11]** are very close to negative one or one?

**[0:16:14]** If you plug in t equals one here

**[0:16:16]** you're going to get a zero multiplying out that grad.

**[0:16:19]** No matter what out that grad is

**[0:16:21]** we are killing the gradient

**[0:16:22]** and we're stopping effectively the back propagation

**[0:16:25]** through this 10h unit.

**[0:16:27]** Similarly when t is negative one

**[0:16:29]** this will again become zero

**[0:16:30]** and out that grad just stops.

**[0:16:32]** And intuitively this makes sense

**[0:16:34]** because this is a 10h neuron

**[0:16:37]** and what's happening is

**[0:16:39]** if its output is very close to one

**[0:16:41]** then we are in the tail of this 10h.

**[0:16:44]** And so changing basically the input

**[0:16:49]** is not going to impact the output of the 10h too much

**[0:16:52]** because it's in a flat region of the 10h.

**[0:16:55]** And so therefore there's no impact on the loss.

**[0:16:58]** And so indeed the weights and the biases

**[0:17:02]** along with this 10h neuron

**[0:17:04]** do not impact the loss

**[0:17:05]** because the output of this 10h unit

**[0:17:07]** is in the flat region of the 10h

**[0:17:08]** and there's no influence.

**[0:17:09]** We can be changing them however we want

**[0:17:13]** and the loss is not impacted.

**[0:17:14]** So that's another way to justify

**[0:17:16]** that indeed the gradient would be

**[0:17:18]** basically zero, it vanishes.

**[0:17:20]** Indeed when t equals zero

**[0:17:24]** we get one times out that grad.

**[0:17:27]** So when the 10h takes on exactly value of zero

**[0:17:31]** then out that grad is just passed through.

**[0:17:34]** So basically what this is doing

**[0:17:36]** is if t is equal to zero

**[0:17:38]** then the 10h unit is sort of inactive

**[0:17:42]** and gradient just passes through.

**[0:17:44]** But the more you are in the flat tails

**[0:17:47]** the more the gradient is squashed.

**[0:17:49]** So in fact you'll see that the gradient

**[0:17:51]** flowing through 10h can only ever decrease

**[0:17:54]** in the amount that it decreases

**[0:17:56]** is proportional through a square here

**[0:18:01]** depending on how far you are in the flat tails

**[0:18:03]** of this 10h.

**[0:18:05]** And so that's kind of what's happening here.

**[0:18:07]** And through the concern here

**[0:18:10]** is that if all of these outputs h

**[0:18:12]** are in the flat regions of negative one and one

**[0:18:15]** then the gradients that are flowing through the network

**[0:18:17]** will just get destroyed at this layer.

**[0:18:21]** Now there is some redeeming quality here

**[0:18:24]** and that we can actually get a sense

**[0:18:25]** of the problem here as follows.

**[0:18:27]** I wrote some code here.

**[0:18:29]** And basically what we want to do here

**[0:18:30]** is we want to take a look at h,

**[0:18:32]** take the absolute value

**[0:18:34]** and see how often it is in the flat region.

**[0:18:38]** So say greater than 0.99.

**[0:18:42]** And what you get is the following

**[0:18:44]** and this is a Boolean tensor.

**[0:18:45]** So in the Boolean tensor you get a white

**[0:18:49]** if this is true and a black if this is false.

**[0:18:52]** And so basically what we have here

**[0:18:53]** is the 32 examples and the 200 hidden neurons.

**[0:18:57]** And we see that a lot of this is white.

**[0:19:00]** And what that's telling us is that all these 10h neurons

**[0:19:04]** where very, very active and they're in a flat tail.

**[0:19:09]** And so in all these cases

**[0:19:12]** the backward gradient would get destroyed.

**[0:19:16]** Now we would be in a lot of trouble

**[0:19:18]** if for any one of these 200 neurons

**[0:19:22]** if it was the case that the entire column is white.

**[0:19:26]** Because in that case we have what's called a dead neuron.

**[0:19:28]** And this could be a 10h neuron

**[0:19:30]** where the initialization of the weights in the biases

**[0:19:32]** could be such that no single example

**[0:19:34]** ever activates this 10h

**[0:19:37]** in the sort of active part of the 10h.

**[0:19:39]** If all the examples land in the tail

**[0:19:43]** then this neuron will never learn.

**[0:19:44]** It is a dead neuron.

**[0:19:46]** And so just scrutinizing this

**[0:19:48]** and looking for columns of completely white

**[0:19:52]** we see that this is not the case.

**[0:19:54]** So I don't see a single neuron that is all of white.

**[0:19:59]** And so therefore it is the case

**[0:20:00]** that for every one of these 10h neurons

**[0:20:04]** we do have some examples that activate them

**[0:20:06]** in the active part of the 10h.

**[0:20:09]** And so some gradients will flow through

**[0:20:10]** and this neuron will learn

**[0:20:12]** and the neuron will change

**[0:20:13]** and it will move and it will do something.

**[0:20:16]** But you can sometimes get yourself in cases

**[0:20:18]** where you have dead neurons.

**[0:20:20]** And the way this manifests is that

**[0:20:22]** for a 10h neuron this would be

**[0:20:24]** when no matter what inputs you plug in from your data set

**[0:20:27]** this 10h neuron always fires completely one

**[0:20:30]** or completely negative one.

**[0:20:31]** And then it will just not learn

**[0:20:33]** because all the gradients will be just zeroed out.

**[0:20:36]** This is true not just for 10h

**[0:20:37]** but for a lot of other non-linearities

**[0:20:39]** that people use in neural networks.

**[0:20:41]** So we certainly use 10h a lot

**[0:20:43]** but sigmoid will have the exact same issue

**[0:20:45]** because it is a squashing neuron.

**[0:20:47]** And so the same will be true for sigmoid

**[0:20:50]** but basically the same will actually apply to sigmoid.

**[0:20:57]** The same will also apply to relu.

**[0:20:59]** So relu has a completely flat region here below zero.

**[0:21:03]** So if you have a relu neuron

**[0:21:05]** then it is a pass-through if it is positive

**[0:21:08]** and if the pre-activation is negative

**[0:21:11]** it will just shut it off.

**[0:21:12]** Since the region here is completely flat

**[0:21:15]** then during back propagation

**[0:21:17]** this would be exactly zeroing out the gradient.

**[0:21:20]** Like all of the gradient would be set exactly to zero

**[0:21:23]** instead of just like a very, very small number

**[0:21:24]** depending on how positive or negative T is.

**[0:21:28]** And so you can get for example a dead relu neuron

**[0:21:31]** and a dead relu neuron would basically look like

**[0:21:35]** basically what it is is

**[0:21:36]** if a neuron with a relu non-linearity never activates

**[0:21:41]** so for any examples that you plug in in the dataset

**[0:21:44]** it never turns on, it's always in this flat region

**[0:21:47]** then this relu neuron is a dead neuron.

**[0:21:49]** It's weights and bias will never learn.

**[0:21:52]** They will never get a gradient

**[0:21:53]** because the neuron never activated.

**[0:21:55]** And this can sometimes happen at initialization

**[0:21:58]** because the weights and the biases just make it

**[0:21:59]** so that by chance some neurons are just forever dead

**[0:22:02]** but it can also happen during optimization.

**[0:22:04]** If you have like a too high of a learning rate

**[0:22:06]** for example, sometimes you have these neurons

**[0:22:08]** that gets too much of a gradient

**[0:22:10]** and they get knocked out of data manifold.

**[0:22:13]** And what happens is that from then on

**[0:22:15]** no example ever activates this neuron

**[0:22:17]** so this neuron remains dead forever.

**[0:22:19]** So it's kind of like a permanent brain damage

**[0:22:21]** in a mind of a network.

**[0:22:23]** And so sometimes what can happen is

**[0:22:25]** if your learning rate is very high for example

**[0:22:27]** and you have a neural net with relu neurons

**[0:22:29]** you train the neural net and you get some last loss

**[0:22:32]** but then actually what you do is

**[0:22:34]** you go through the entire training set

**[0:22:36]** and you forward your examples

**[0:22:39]** and you can find neurons that never activate.

**[0:22:42]** They are dead neurons in your network.

**[0:22:44]** And so those neurons will never turn on.

**[0:22:46]** And usually what happens is that during training

**[0:22:48]** these relu neurons are changing, moving, et cetera.

**[0:22:50]** And then because of a high gradient somewhere by chance

**[0:22:53]** they get knocked off and then nothing ever activates them

**[0:22:56]** and from then on they are just dead.

**[0:22:59]** So that's kind of like a permanent brain damage

**[0:23:00]** that can happen to some of these neurons.

**[0:23:03]** These other nonlinearities like leaky relu

**[0:23:05]** will not suffer from this issue as much

**[0:23:07]** because you can see that it doesn't have flat tails.

**[0:23:10]** You'll almost always get gradients.

**[0:23:12]** And elu is also fairly frequently used.

**[0:23:16]** It also might suffer from this issue

**[0:23:17]** because it has flat parts.

**[0:23:20]** So that's just something to be aware of

**[0:23:22]** and something to be concerned about.

**[0:23:24]** And in this case we have way too many activations H

**[0:23:28]** that take on extreme values

**[0:23:30]** and because there's no column of white

**[0:23:32]** I think we will be okay.

**[0:23:34]** And indeed the network optimizes

**[0:23:35]** and gives us a pretty decent loss

**[0:23:37]** but it's just not optimal.

**[0:23:38]** And this is not something you want

**[0:23:40]** especially during initialization.

**[0:23:42]** And so basically what's happening is that

**[0:23:45]** this H pre-activation that's flowing to 10 H

**[0:23:48]** it's too extreme.

**[0:23:49]** It's too large.

**[0:23:51]** It's creating a distribution that is too saturated

**[0:23:55]** in both sides of the 10 H.

**[0:23:57]** And it's not something you want

**[0:23:58]** because it means that there's less training

**[0:24:01]** for these neurons because they update less frequently.

**[0:24:05]** So how do we fix this?

**[0:24:07]** Well H pre-activation is MCAT

**[0:24:11]** which comes from C.

**[0:24:12]** So these are uniform Gaussian

**[0:24:15]** but then it's multiplied by W1 plus B1.

**[0:24:17]** And H pre-act is too far off from zero

**[0:24:20]** and that's causing the issue.

**[0:24:21]** So we want this pre-activation to be closer to zero

**[0:24:24]** very similar to what we had with logits.

**[0:24:27]** So here we want actually something very, very similar.

**[0:24:31]** Now it's okay to set the biases

**[0:24:33]** to very small number.

**[0:24:35]** We can either multiply by zero, zero, one

**[0:24:36]** to get like a little bit of entropy.

**[0:24:39]** I sometimes like to do that

**[0:24:41]** just so that there's like a little bit of variation

**[0:24:45]** and diversity in the original initialization

**[0:24:48]** of these 10 H neurons.

**[0:24:49]** And I find in practice that that can help

**[0:24:51]** optimization a little bit.

**[0:24:53]** And then the weights we can also just like squash.

**[0:24:56]** So let's multiply everything by 0.1.

**[0:24:59]** Let's rerun the first batch.

**[0:25:01]** And now let's look at this.

**[0:25:03]** And well, first let's look at here.

**[0:25:07]** You see now because we multiply W by 0.1

**[0:25:09]** we have a much better histogram.

**[0:25:11]** And that's because the pre-activations

**[0:25:12]** are now between negative 1.5 and 1.5.

**[0:25:14]** And this we expect much, much less white.

**[0:25:18]** Okay, there's no white.

**[0:25:20]** So basically that's because there are no neurons

**[0:25:23]** that saturated above 0.99 in either direction.

**[0:25:28]** So this is actually a pretty decent place to be.

**[0:25:31]** Maybe we can go up a little bit.

**[0:25:36]** Sorry, am I changing W1 here?

**[0:25:39]** So maybe we can go to 0.2.

**[0:25:42]** Okay, so maybe something like this is a nice distribution.

**[0:25:46]** So maybe this is what our initialization should be.

**[0:25:49]** So let me now erase these

**[0:25:53]** and let me, starting with initialization,

**[0:25:56]** let me run the full optimization without the break.

**[0:26:00]** And let's see what we get.

**[0:26:03]** Okay, so the optimization finished

**[0:26:04]** and I rebrand loss and this is the result that we get.

**[0:26:08]** And then just as a reminder,

**[0:26:09]** I put down all the losses that we saw previously

**[0:26:11]** in this lecture.

**[0:26:12]** So we see that we actually do get an improvement here.

**[0:26:15]** And just as a reminder,

**[0:26:16]** we started off with a validation loss of 2.17

**[0:26:18]** when we started.

**[0:26:20]** By fixing the softmax being confidently wrong,

**[0:26:22]** we came down to 2.13

**[0:26:24]** and by fixing the 10-inch layer

**[0:26:25]** being way too saturated, we came down to 2.10.

**[0:26:28]** And the reason this is happening, of course,

**[0:26:30]** is because our initialization is better.

**[0:26:31]** And so we're spending more time doing productive training

**[0:26:34]** instead of not very productive training

**[0:26:38]** because our gradients are set to zero

**[0:26:40]** and we have to learn very simple things

**[0:26:42]** like the overconfidence of the softmax in the beginning

**[0:26:45]** and we're spending cycles just like squashing

**[0:26:47]** down the weight matrix.

**[0:26:48]** So this is illustrating basically initialization

**[0:26:53]** and its impacts on performance

**[0:26:55]** just by being aware of the internals of these neural nuts

**[0:26:58]** and their activations and their gradients.

**[0:27:00]** Now, we're working with a very small network.

**[0:27:02]** This is just one layer multi-layer perception.

**[0:27:05]** So because the network is so shallow,

**[0:27:07]** the optimization problem is actually quite easy

**[0:27:09]** and very forgiving.

**[0:27:11]** So even though our initialization was terrible,

**[0:27:13]** the network still learned eventually.

**[0:27:15]** It just got a bit worse result.

**[0:27:17]** This is not the case in general, though.

**[0:27:19]** Once we actually start working with much deeper networks

**[0:27:22]** that have, say, 50 layers,

**[0:27:24]** things can get much more complicated

**[0:27:27]** and these problems stack up.

**[0:27:30]** And so you can actually get into a place

**[0:27:33]** where the network is basically not training at all

**[0:27:35]** if your initialization is bad enough.

**[0:27:37]** And the deeper your network is

**[0:27:38]** and the more complex it is,

**[0:27:39]** the less forgiving it is to some of these errors.

**[0:27:43]** And so something to be definitely aware of

**[0:27:46]** and something to scrutinize,

**[0:27:48]** something to plot and something to be careful with.

**[0:27:51]** And yeah.

**[0:27:53]** Okay, so that's great that that worked for us.

**[0:27:55]** But what we have here now is all these magic numbers

**[0:27:58]** like 0.2, like where do I come up with this?

**[0:28:00]** And how am I supposed to set these

**[0:28:02]** if I have a large neural net with lots and lots of layers?

**[0:28:05]** And so obviously no one does this by hand.

**[0:28:07]** There's actually some relatively principled ways

**[0:28:09]** of setting these scales

**[0:28:11]** that I would like to introduce to you now.

**[0:28:14]** So let me paste some code here that I prepared

**[0:28:16]** just to motivate the discussion of this.

**[0:28:19]** So what I'm doing here is we have some random input here

**[0:28:22]** X that is drawn from a Gaussian

**[0:28:25]** and there's 1000 examples that are 10 dimensional.

**[0:28:28]** And then we have a weight in layer here

**[0:28:30]** that is also initialized using Gaussian

**[0:28:33]** just like we did here.

**[0:28:34]** And we hit these neurons in the hidden layer

**[0:28:37]** look at 10 inputs

**[0:28:38]** and there are 200 neurons in this hidden layer.

**[0:28:41]** And then we have here just like here

**[0:28:44]** in this case, the multiplication X multiplied by W

**[0:28:47]** to get the pre-activations of these neurons.

**[0:28:50]** And basically the analysis here looks at,

**[0:28:53]** okay, suppose these are uniform Gaussian

**[0:28:55]** and these weights are uniform Gaussian.

**[0:28:57]** If I do X times W

**[0:28:58]** and we forget for now the bias and the non-linearity

**[0:29:03]** then what is the mean and the standard deviation

**[0:29:05]** of these Gaussians?

**[0:29:06]** So in the beginning here,

**[0:29:07]** the input is just a normal Gaussian distribution.

**[0:29:10]** Mean zero and the standard deviation is one.

**[0:29:13]** And the standard deviation again

**[0:29:14]** is just the measure of a spread of the Gaussian.

**[0:29:18]** But then once we multiply here

**[0:29:19]** and we look at the histogram of Y,

**[0:29:23]** we see that the mean of course stays the same.

**[0:29:25]** It's about zero because this is a symmetric operation.

**[0:29:28]** But we see here that the standard deviation

**[0:29:30]** has expanded to three.

**[0:29:32]** So the input standard deviation was one

**[0:29:34]** but now we've grown to three.

**[0:29:36]** And so what you're seeing in the histogram

**[0:29:37]** is that this Gaussian is expanding.

**[0:29:41]** And so we're expanding this Gaussian from the input.

**[0:29:45]** And we don't want that.

**[0:29:46]** We want most of the neural nets

**[0:29:47]** to have relatively similar activations.

**[0:29:50]** So unit Gaussian roughly throughout the neural net.

**[0:29:53]** As the question is, how do we scale these W's

**[0:29:56]** to preserve this distribution to remain a Gaussian?

**[0:30:03]** And so intuitively, if I multiply here

**[0:30:06]** these elements of W by a large number, let's say by five,

**[0:30:11]** then this Gaussian grows and grows

**[0:30:14]** and standard deviation.

**[0:30:15]** So now we're at 15.

**[0:30:17]** So basically these numbers here in the output Y

**[0:30:20]** take on more and more extreme values.

**[0:30:22]** But if we scale it down, like say 0.2, then conversely

**[0:30:26]** this Gaussian is getting smaller and smaller

**[0:30:29]** and it's shrinking.

**[0:30:31]** And you can see that the standard deviation is 0.6.

**[0:30:33]** And so the question is,

**[0:30:34]** what do I multiply by here

**[0:30:36]** to exactly preserve the standard deviation to be one?

**[0:30:40]** And it turns out that the correct answer mathematically

**[0:30:42]** when you work out through the variance

**[0:30:44]** of this multiplication here

**[0:30:47]** is that you are supposed to divide

**[0:30:49]** by the square root of the fan in.

**[0:30:52]** The fan in is the basically the number

**[0:30:56]** of input elements here, 10.

**[0:30:58]** So we are supposed to divide by 10 square root.

**[0:31:00]** And this is one way to do the square root.

**[0:31:02]** You raise it to a power of 0.5.

**[0:31:04]** That's the same as doing a square root.

**[0:31:07]** So when you divide by the square root of 10,

**[0:31:10]** then we see that the output Gaussian,

**[0:31:14]** it has exactly standard deviation of one.

**[0:31:17]** Now unsurprisingly, a number of papers

**[0:31:19]** have looked into how to best initialize neural networks.

**[0:31:23]** And in the case of multivariate perceptions,

**[0:31:25]** we can have fairly deep networks

**[0:31:26]** that had these nonlinearities in between.

**[0:31:29]** And we want to make sure that the activations

**[0:31:30]** are well behaved and they don't expand to infinity

**[0:31:33]** or shrink all the way to zero.

**[0:31:35]** And the question is,

**[0:31:36]** how do we initialize the weights

**[0:31:37]** so that these activations take on reasonable values

**[0:31:39]** throughout the network?

**[0:31:40]** Now, one paper that has studied this

**[0:31:42]** in quite a bit detail that is often referenced

**[0:31:45]** is this paper by Keiming He et al.

**[0:31:47]** Called Delving Deep Interactive Fires.

**[0:31:49]** Now in this case, they actually study

**[0:31:50]** convolutional neural networks

**[0:31:52]** and they studied especially the ReLU nonlinearity

**[0:31:56]** and the P-ReLU nonlinearity instead of a 10-H nonlinearity.

**[0:31:59]** But the analysis is very similar

**[0:32:01]** and basically what happens here is

**[0:32:05]** for them the ReLU nonlinearity

**[0:32:07]** that they care about quite a bit here

**[0:32:09]** is a squashing function

**[0:32:11]** where all the negative numbers

**[0:32:13]** are simply clamped to zero.

**[0:32:15]** So the positive numbers are a path through

**[0:32:17]** but everything negative is just set to zero.

**[0:32:20]** And because you are basically throwing away

**[0:32:23]** half of the distribution,

**[0:32:24]** they find in their analysis

**[0:32:26]** of the forward activations in the neural net

**[0:32:28]** that you have to compensate for that with a gain.

**[0:32:32]** And so here,

**[0:32:33]** they find that basically when they initialize their weights

**[0:32:37]** they have to do it with a zero mean Gaussian

**[0:32:39]** whose standard deviation is square root of two

**[0:32:41]** over the fan in.

**[0:32:43]** What we have here is we are initializing Gaussian

**[0:32:46]** with the square root of fan in.

**[0:32:49]** This NL here is the fan in.

**[0:32:50]** So what we have is square root of one over the fan in

**[0:32:55]** because we have the division here.

**[0:32:58]** Now they have to add this factor of two

**[0:33:00]** because of the ReLU which basically discards

**[0:33:02]** half of the distribution and clamps it at zero.

**[0:33:05]** And so that's where you get an initial factor.

**[0:33:08]** Now in addition to that,

**[0:33:09]** this paper also studies

**[0:33:10]** not just the sort of behavior of the activations

**[0:33:13]** in the forward pass of the neural net

**[0:33:15]** but it also studies the back propagation.

**[0:33:17]** And we have to make sure that the gradients also

**[0:33:19]** are well-behaved.

**[0:33:20]** And so because ultimately they end up updating our parameters.

**[0:33:25]** And what they find here through a lot of the analysis

**[0:33:28]** that I have much to read through

**[0:33:29]** but it's not exactly approachable.

**[0:33:31]** What they find is basically

**[0:33:33]** if you properly initialize the forward pass,

**[0:33:36]** the backward pass is also approximately initialized

**[0:33:39]** up to a constant factor that has to do with

**[0:33:42]** the size of the number of hidden neurons

**[0:33:45]** in an early and a late layer.

**[0:33:48]** And but basically they find empirically

**[0:33:51]** that this is not a choice that matters too much.

**[0:33:54]** Now this chiming initialization

**[0:33:55]** is also implemented in PyTorch.

**[0:33:58]** So if you go to torch.innet documentation,

**[0:34:00]** you'll find chiming normal.

**[0:34:02]** And in my opinion,

**[0:34:03]** this is probably the most common way

**[0:34:05]** of initializing neural networks now.

**[0:34:07]** And it takes a few keyword arguments here.

**[0:34:09]** So another one, it wants to know the mode.

**[0:34:12]** Would you like to normalize the activations

**[0:34:14]** or would you like to normalize the gradients

**[0:34:16]** to be always Gaussian with zero mean

**[0:34:19]** and unit or one standard deviation?

**[0:34:22]** And because they find a paper

**[0:34:23]** that this doesn't matter too much,

**[0:34:25]** most of the people just leave it as the default

**[0:34:26]** which is fan in.

**[0:34:28]** And then second, pass in the nonlinearity

**[0:34:30]** that you are using.

**[0:34:31]** Because depending on the nonlinearity,

**[0:34:33]** we need to calculate a slightly different gain.

**[0:34:35]** And so if your nonlinearity is just linear,

**[0:34:39]** so there's no nonlinearity,

**[0:34:40]** then the gain here will be one

**[0:34:42]** and we have the exact same kind of formula

**[0:34:44]** that we've caught up here.

**[0:34:46]** But if the nonlinearity is something else,

**[0:34:47]** we're going to get a slightly different gain.

**[0:34:49]** And so if we come up here to the top,

**[0:34:52]** we see that, for example, in the case of ReLU,

**[0:34:54]** this gain is a square root of two.

**[0:34:56]** And the reason it's a square root

**[0:34:57]** because in this paper,

**[0:35:03]** you see how the two is inside of the square root.

**[0:35:06]** So the gain is a square root of two.

**[0:35:09]** In a case of linear or identity,

**[0:35:11]** we just get a gain of one.

**[0:35:13]** In the case of 10H, which is what we're using here,

**[0:35:16]** the advised gain is a five over three.

**[0:35:18]** And intuitively, why do we need a gain

**[0:35:21]** on top of the initialization?

**[0:35:22]** It's because 10H, just like ReLU,

**[0:35:24]** is a contractive transformation.

**[0:35:27]** So what that means is you're taking the output distribution

**[0:35:29]** from this matrix multiplication

**[0:35:31]** and then you are squashing it in some way.

**[0:35:33]** Now ReLU squashes it by taking everything below zero

**[0:35:36]** and clamping it to zero.

**[0:35:37]** 10H also squashes it

**[0:35:39]** because it's a contractive operation.

**[0:35:40]** It will take the tails

**[0:35:41]** and it will squeeze them in.

**[0:35:44]** And so in order to fight the squeezing in,

**[0:35:46]** we need to boost the weights a little bit

**[0:35:49]** so that we renormalize everything

**[0:35:50]** back to standard unit standard deviation.

**[0:35:53]** So that's why there's a little bit of a gain that comes out.

**[0:35:56]** Now I'm skipping through this section a little bit quickly

**[0:35:58]** and I'm doing that actually intentionally.

**[0:36:00]** And the reason for that

**[0:36:01]** is because about seven years ago

**[0:36:04]** when this paper was written,

**[0:36:06]** you had to actually be extremely careful

**[0:36:07]** with the activations and the gradients

**[0:36:09]** and their ranges and their histograms.

**[0:36:11]** And you have to be very careful

**[0:36:12]** with the precise setting of gains

**[0:36:14]** and the scrutinizing of the non-linearity is used and so on.

**[0:36:17]** And everything was very finicky and very fragile

**[0:36:19]** and to be very properly arranged for the neural net to train,

**[0:36:22]** especially if your neural net was very deep.

**[0:36:24]** But there are a number of modern innovations

**[0:36:26]** that have made everything significantly more stable

**[0:36:28]** and more well-behaved.

**[0:36:29]** And it's become less important

**[0:36:30]** to initialize these networks exactly right.

**[0:36:34]** And some of those modern innovations, for example,

**[0:36:35]** are residual connections,

**[0:36:37]** which we will cover in the future.

**[0:36:39]** The use of a number of normalization layers,

**[0:36:42]** like for example, batch normalization,

**[0:36:44]** layer normalization, group normalization,

**[0:36:47]** we're going to go into a lot of these as well.

**[0:36:48]** And number three, much better optimizers,

**[0:36:50]** not just to cast a gradient descent,

**[0:36:52]** the simple optimizer we're basically using here,

**[0:36:55]** but slightly more complex optimizers

**[0:36:57]** like RMS Prop and especially Adam.

**[0:36:59]** And so all of these modern innovations

**[0:37:01]** make it less important for you

**[0:37:02]** to precisely calibrate the initialization

**[0:37:04]** of the neural net.

**[0:37:06]** All that being said in practice,

**[0:37:08]** what should we do?

**[0:37:09]** In practice, when I initialize these neural nets,

**[0:37:11]** I basically just normalize my weights

**[0:37:13]** by the square root of the fan in.

**[0:37:15]** So basically roughly what we did here is what I do.

**[0:37:20]** Now, if we want to be exactly accurate here,

**[0:37:23]** we can go back in it of coming normal.

**[0:37:27]** This is how it would implemented.

**[0:37:29]** We want to set the standard deviation

**[0:37:31]** to be gained over the square root of fan in, right?

**[0:37:35]** So to set the standard deviation of our weights,

**[0:37:39]** we will proceed as follows.

**[0:37:41]** Basically, when we have a torsion random,

**[0:37:43]** and let's say I just create a thousand numbers,

**[0:37:46]** we can look at the standard deviation of this.

**[0:37:47]** And of course, that's one, that's the amount of spread.

**[0:37:50]** Let's make this a bit bigger, so it's closer to one.

**[0:37:52]** So that's the spread of the Gaussian

**[0:37:54]** of zero mean and unit standard deviation.

**[0:37:58]** Now, basically when you take these

**[0:37:59]** and you multiply by say point two,

**[0:38:02]** that basically scales down the Gaussian

**[0:38:04]** and that makes its standard deviation point two.

**[0:38:07]** So basically the number that you multiply by here

**[0:38:09]** ends up being the standard deviation of this Gaussian.

**[0:38:12]** So here, this is a standard deviation point two Gaussian

**[0:38:16]** here when we sample our w one.

**[0:38:19]** But we want to set the standard deviation

**[0:38:20]** to gain over square root of fan mode, which is fan in.

**[0:38:26]** So in other words, we want to multiply by gain

**[0:38:29]** which for 10h is five over three.

**[0:38:34]** Five over three is the gain.

**[0:38:36]** And then times, I guess divide square root of the fan in.

**[0:38:51]** And in this example here, the fan in was 10.

**[0:38:53]** And I just noticed that actually here,

**[0:38:55]** the fan in for w one is actually

**[0:38:58]** an embed times block size,

**[0:38:59]** which as you will recall is actually 30.

**[0:39:01]** And that's because each character is 10 dimensional,

**[0:39:03]** but then we have three of them and we concatenate them.

**[0:39:05]** So actually the fan in here was 30

**[0:39:08]** and I should have used 30 here probably.

**[0:39:10]** But basically we want 30 square root.

**[0:39:13]** So this is the number.

**[0:39:14]** This is what our standard deviation we want to be.

**[0:39:17]** And this number turns out to be point three.

**[0:39:19]** Whereas here, just by fiddling with it

**[0:39:21]** and looking at the distribution

**[0:39:22]** and making sure it looks okay, we came up with point two.

**[0:39:25]** And so instead, what we want to do here

**[0:39:27]** is we want to make the standard deviation be

**[0:39:31]** five over three, which is our gain, divide.

**[0:39:37]** This amount times point two, square root.

**[0:39:41]** And these brackets here are not that necessary,

**[0:39:44]** but I'll just put them here for clarity.

**[0:39:46]** This is basically what we want.

**[0:39:47]** This is the chiming in it,

**[0:39:49]** in our case for a 10H nonlinearity.

**[0:39:52]** And this is how we would initialize the neural net.

**[0:39:54]** And so we're multiplying by point three,

**[0:39:58]** instead of multiplying by point two.

**[0:40:01]** And so we can initialize this way.

**[0:40:05]** And then we can train the neural net and see what we got.

**[0:40:08]** Okay, so I trained the neural net

**[0:40:09]** and we end up in roughly the same spot.

**[0:40:12]** So looking at the validation loss, we now get 2.10.

**[0:40:15]** And previously we also had 2.10.

**[0:40:17]** There's a little bit of a difference,

**[0:40:18]** but that's just the randomness, the process I suspect.

**[0:40:21]** But the big deal of course is we get to the same spot,

**[0:40:24]** but we did not have to introduce any magic numbers

**[0:40:29]** that we got from just looking at histograms

**[0:40:31]** and guessing checking.

**[0:40:32]** We have something that is semi-principled

**[0:40:34]** and will scale us to much bigger networks

**[0:40:37]** and something that we can sort of use as a guide.

**[0:40:40]** So I mentioned that the precise setting

**[0:40:41]** of these initializations is not as important today

**[0:40:44]** due to some modern innovations.

**[0:40:46]** And I think now is a pretty good time

**[0:40:47]** to introduce one of those modern innovations

**[0:40:49]** and that is batch normalization.

**[0:40:51]** So batch normalization came out in 2015

**[0:40:54]** from a team at Google.

**[0:40:55]** And it was an extremely impactful paper

**[0:40:57]** because it made it possible to train

**[0:41:00]** very deep neural nets quite reliably

**[0:41:02]** and it basically just worked.

**[0:41:05]** So here's what batch normalization does

**[0:41:06]** and let's implement it.

**[0:41:09]** Basically we have these hidden states H-preact, right?

**[0:41:13]** And we were talking about how we don't want

**[0:41:15]** these pre-activation states to be way too small

**[0:41:20]** because then the 10-H is not doing anything,

**[0:41:23]** but we don't want them to be too large

**[0:41:25]** because then the 10-H is saturated.

**[0:41:27]** In fact, we want them to be roughly Gaussian.

**[0:41:30]** So zero mean and a unit or one standard deviation,

**[0:41:34]** at least at initialization.

**[0:41:36]** So the insight from the batch normalization paper is,

**[0:41:39]** okay, you have these hidden states

**[0:41:41]** and you'd like them to be roughly Gaussian,

**[0:41:43]** then why not take the hidden states

**[0:41:45]** and just normalize them to be Gaussian?

**[0:41:48]** And it sounds kind of crazy,

**[0:41:49]** but you can just do that

**[0:41:51]** because standardizing hidden states

**[0:41:55]** so that their unit Gaussian

**[0:41:56]** is a perfectly differentiable operation as we'll soon see.

**[0:41:59]** And so that was kind of like the big insight in this paper

**[0:42:02]** and when I first read it, my mind was blown

**[0:42:04]** because you can just normalize these hidden states

**[0:42:06]** and if you'd like unit Gaussian states in your network,

**[0:42:09]** at least initialization,

**[0:42:11]** you can just normalize them to be unit Gaussian.

**[0:42:14]** So let's see how that works.

**[0:42:16]** So we're going to scroll to our pre-activations here

**[0:42:18]** just before they enter into the 10-H.

**[0:42:21]** Now the idea again is, remember,

**[0:42:22]** we're trying to make these roughly Gaussian

**[0:42:25]** and that's because if these are way too small numbers,

**[0:42:27]** then the 10-H here is kind of inactive,

**[0:42:30]** but if these are very large numbers,

**[0:42:32]** then the 10-H is way too saturated

**[0:42:35]** and great as no flow.

**[0:42:36]** So we'd like this to be roughly Gaussian.

**[0:42:39]** So the insight in batch normalization again

**[0:42:41]** is that we can just standardize these activations

**[0:42:44]** so they are exactly Gaussian.

**[0:42:46]** So here, H-preact has a shape of 32 by 200,

**[0:42:52]** 32 examples by 200 neurons in the hidden layer.

**[0:42:56]** So basically what we can do is we can take H-preact

**[0:42:58]** and we can just calculate the mean

**[0:43:01]** and the mean we want to calculate across the zero dimension

**[0:43:05]** and we want to also keep them as true

**[0:43:08]** so that we can easily broadcast this.

**[0:43:11]** So the shape of this is one by 200.

**[0:43:14]** In other words,

**[0:43:15]** we are doing the mean over all the elements in the batch

**[0:43:20]** and similarly we can calculate the standard deviation

**[0:43:23]** of these activations

**[0:43:26]** and that will also be one by 200.

**[0:43:29]** Now in this paper, they have the sort of prescription here

**[0:43:34]** and see here we are calculating the mean

**[0:43:36]** which is just taking the average value

**[0:43:41]** of any neurons activation

**[0:43:43]** and then the standard deviation is basically kind of like

**[0:43:47]** the measure of the spread that we've been using

**[0:43:50]** which is the distance of every one of these values

**[0:43:53]** away from the mean and that squared and averaged.

**[0:43:58]** That's the variance

**[0:44:01]** and then if you want to take the standard deviation

**[0:44:03]** you would square root the variance

**[0:44:05]** to get the standard deviation.

**[0:44:07]** So these are the two that we're calculating

**[0:44:10]** and now we're going to normalize or standardize these axes

**[0:44:13]** by subtracting the mean

**[0:44:14]** and dividing by the standard deviation.

**[0:44:17]** So basically we're taking edge preact

**[0:44:20]** and we subtract the mean

**[0:44:29]** and then we divide by the standard deviation.

**[0:44:34]** This is exactly what these two,

**[0:44:35]** STD and mean are calculating.

**[0:44:38]** Oops, sorry.

**[0:44:41]** This is the mean and this is the variance.

**[0:44:43]** You see how the sigma is the standard deviation usually.

**[0:44:45]** So this is sigma square

**[0:44:46]** which the variance is the square of the standard deviation.

**[0:44:50]** So this is how you standardize these values

**[0:44:53]** and what this will do is that every single neuron now

**[0:44:55]** and its firing rate will be exactly unit Gaussian

**[0:44:58]** on these 32 examples at least of this batch.

**[0:45:01]** That's why it's called batch normalization.

**[0:45:03]** We are normalizing these batches

**[0:45:06]** and then we could in principle train this.

**[0:45:09]** Notice that calculating the mean and your standard deviation

**[0:45:12]** these are just mathematical formulas.

**[0:45:13]** They're perfectly differentiable.

**[0:45:15]** All of this is perfectly differentiable

**[0:45:16]** and we can just train this.

**[0:45:18]** The problem is you actually won't achieve

**[0:45:20]** a very good result with this.

**[0:45:23]** And the reason for that is we want these to be roughly

**[0:45:27]** Gaussian but only at initialization.

**[0:45:29]** But we don't want these to be forced to be Gaussian always.

**[0:45:34]** We'd like to allow the neural net to move this around

**[0:45:37]** to potentially make it more diffuse,

**[0:45:39]** to make it more sharp,

**[0:45:40]** to make some 10-inch neurons maybe more trigger happy

**[0:45:44]** or less trigger happy.

**[0:45:45]** So we'd like this distribution to move around

**[0:45:47]** and we'd like the back propagation to tell us

**[0:45:49]** how the distribution should move around.

**[0:45:52]** And so in addition to this idea of standardizing

**[0:45:55]** the activations at any point in the network,

**[0:45:59]** we have to also introduce

**[0:46:00]** this additional component in the paper

**[0:46:02]** here described as scale and shift.

**[0:46:05]** And so basically what we're doing is

**[0:46:06]** we're taking these normalized inputs

**[0:46:09]** and we are additionally scaling them by some gain

**[0:46:12]** and offsetting them by some bias

**[0:46:14]** to get our final output from this layer.

**[0:46:17]** And so what that amounts to is the following.

**[0:46:20]** We are going to allow a batch normalization gain

**[0:46:23]** to be initialized at just a once

**[0:46:27]** and the once will be in the shape of one by N hidden.

**[0:46:32]** And then we also will have a BN bias

**[0:46:35]** which will be torched at zeros

**[0:46:37]** and it will also be of the shape N by one by N hidden.

**[0:46:42]** And then here the BN gain will multiply this

**[0:46:47]** and the BN bias will offset it here.

**[0:46:51]** So because this is initialized to one and this to zero

**[0:46:54]** at initialization, each neurons firing values in this batch

**[0:46:59]** will be exactly unit Gaussian and will have nice numbers

**[0:47:03]** no matter what the distribution of the H preact is coming in

**[0:47:07]** coming out, it will be unit Gaussian for each neuron

**[0:47:09]** and that's roughly what we want

**[0:47:10]** at least at initialization.

**[0:47:13]** And then during optimization, we'll be able to back propagate

**[0:47:16]** to BN gain and BN bias and change them

**[0:47:19]** so the network is given the full ability to do with this

**[0:47:22]** whatever it wants internally.

**[0:47:25]** Here we just have to make sure that we include these

**[0:47:30]** in the parameters of the neural net

**[0:47:32]** because they will be trained with back propagation.

**[0:47:35]** So let's initialize this

**[0:47:37]** and then we should be able to train

**[0:47:45]** and then we're going to also copy this line

**[0:47:49]** which is the best normalization layer

**[0:47:51]** here on the single line of code

**[0:47:53]** and we're going to swing down here

**[0:47:54]** and we're also going to do the exact same thing

**[0:47:57]** at test time here.

**[0:48:01]** So similar to train time, we're going to normalize

**[0:48:05]** and then scale and that's going to give us

**[0:48:07]** our train and validation loss.

**[0:48:10]** And we'll see in a second that we're actually

**[0:48:12]** going to change this a little bit

**[0:48:13]** but for now I'm going to keep it this way.

**[0:48:15]** So I'm just going to wait for this to converge.

**[0:48:17]** Okay, so I allowed the neural nets to converge here

**[0:48:20]** and when we scroll down

**[0:48:20]** we see that our validation loss here is 2.10 roughly

**[0:48:24]** which I wrote down here

**[0:48:26]** and we see that this is actually kind of comparable

**[0:48:28]** to some of the results that we've achieved previously.

**[0:48:31]** Now I'm not actually expecting an improvement in this case

**[0:48:34]** and that's because we are dealing with a very simple

**[0:48:36]** neural net that has just a single hidden layer.

**[0:48:39]** So in fact, in this very simple case

**[0:48:41]** of just one hidden layer

**[0:48:43]** we were able to actually calculate

**[0:48:44]** what the scale of W should be

**[0:48:46]** to make these pre-activations

**[0:48:48]** already have a roughly Gaussian shape.

**[0:48:50]** So the batch normalization is not doing much here

**[0:48:53]** but you might imagine that once you have

**[0:48:54]** a much deeper neural net

**[0:48:56]** that has lots of different types of operations

**[0:48:59]** and there's also for example residual connections

**[0:49:01]** which we'll cover and so on

**[0:49:02]** it will become basically very very difficult

**[0:49:05]** to tune the scales of your weight matrices

**[0:49:08]** such that all the activations

**[0:49:10]** throughout the neural net are roughly Gaussian.

**[0:49:12]** And so that's going to become

**[0:49:14]** very quickly intractable

**[0:49:15]** but compared to that it's going to be much much easier

**[0:49:18]** to sprinkle batch normalization layers

**[0:49:20]** throughout the neural net.

**[0:49:22]** So in particular it's common

**[0:49:24]** to look at every single linear layer like this one.

**[0:49:27]** This is a linear layer multiplying by weight matrix

**[0:49:29]** and adding the bias.

**[0:49:30]** Or for example, convolutions which we'll cover later

**[0:49:33]** and also perform basically a multiplication

**[0:49:36]** with weight matrix

**[0:49:37]** but in a more spatially structured format.

**[0:49:39]** It's customary to take these linear layer

**[0:49:42]** or convolutional layer

**[0:49:43]** and append a batch normalization layer right after it

**[0:49:47]** to control the scale of these activations

**[0:49:50]** at every point in the neural net.

**[0:49:51]** So we'd be adding these batch normalization layers

**[0:49:53]** throughout the neural net

**[0:49:54]** and then this controls the scale of these activations

**[0:49:57]** throughout the neural net.

**[0:49:58]** It doesn't require us to do perfect mathematics

**[0:50:01]** and care about the activation distributions

**[0:50:04]** for all these different types of neural net

**[0:50:06]** Lego building blocks

**[0:50:07]** that you might want to introduce into your neural net

**[0:50:09]** and it significantly stabilizes the training

**[0:50:12]** and that's why these layers are quite popular.

**[0:50:14]** Now the stability offered by batch normalization

**[0:50:16]** actually comes at a terrible cost

**[0:50:18]** and that cost is that if you think about what's happening here

**[0:50:22]** something terribly strange and unnatural is happening.

**[0:50:26]** It used to be that we have a single example

**[0:50:28]** feeding into a neural net

**[0:50:30]** and then we calculate these activations

**[0:50:32]** and its logits

**[0:50:34]** and this is a deterministic sort of process

**[0:50:37]** so you arrive at some logits for this example.

**[0:50:40]** And then because of efficiency of training

**[0:50:42]** we suddenly started to use batches of examples

**[0:50:44]** but those batches of examples were processed independently

**[0:50:47]** and it was just an efficiency thing.

**[0:50:49]** But now suddenly in batch normalization

**[0:50:51]** because of the normalization through the batch

**[0:50:53]** we are coupling these examples mathematically

**[0:50:56]** and in the forward pass

**[0:50:57]** and the backward pass of a neural net.

**[0:50:59]** So now the hidden state activations HP Act

**[0:51:02]** and your logits for any one input example

**[0:51:05]** are not just a function of that example and its input

**[0:51:08]** but they're also a function of all the other examples

**[0:51:10]** that happen to come for a ride in that batch

**[0:51:14]** and these examples are sampled randomly.

**[0:51:16]** And so what's happening is for example

**[0:51:17]** when you look at HP Act that's gonna feed into H

**[0:51:20]** the hidden state activations for example

**[0:51:23]** for any one of these input examples

**[0:51:25]** is going to actually change slightly

**[0:51:27]** depending on what other examples there are in a batch

**[0:51:30]** and depending on what other examples

**[0:51:32]** happen to come for a ride

**[0:51:34]** H is going to change suddenly

**[0:51:36]** and it's going to like jitter

**[0:51:37]** if you imagine sampling different examples

**[0:51:39]** because the statistics of the mean understanding deviation

**[0:51:42]** are going to be impacted.

**[0:51:44]** And so you'll get a jitter for H

**[0:51:45]** and you'll get a jitter for logits.

**[0:51:48]** And you'd think that this would be a bug

**[0:51:50]** or something undesirable

**[0:51:52]** but in a very strange way

**[0:51:54]** this actually turns out to be good

**[0:51:56]** in neural network training and as a side effect.

**[0:51:59]** And the reason for that

**[0:52:00]** is that you can think of this

**[0:52:01]** as kind of like a regularizer

**[0:52:04]** because what's happening is you have your input

**[0:52:05]** and you get your H

**[0:52:06]** and then depending on the other examples

**[0:52:08]** this is jittering a bit.

**[0:52:10]** And so what that does

**[0:52:10]** is that it's effectively padding out

**[0:52:12]** any one of these input examples

**[0:52:14]** and it's introducing a little bit of entropy

**[0:52:16]** and because of the padding out

**[0:52:18]** it's actually kind of like a form of data augmentation

**[0:52:21]** which we'll cover in the future

**[0:52:22]** and it's like kind of like augmenting

**[0:52:24]** the input a little bit and it's jittering it

**[0:52:26]** and that makes it harder for the neural nets

**[0:52:28]** to overfit these concrete specific examples.

**[0:52:32]** So by introducing all this noise

**[0:52:33]** it actually like pads out the examples

**[0:52:35]** and it regularizes the neural net.

**[0:52:37]** And that's one of the reasons why

**[0:52:40]** deceivingly as a second order effect

**[0:52:42]** this is actually a regularizer

**[0:52:43]** and that has made it harder

**[0:52:45]** for us to remove the use of batch normalization.

**[0:52:48]** Because basically no one likes this property

**[0:52:50]** that the examples in a batch

**[0:52:52]** are coupled mathematically and in the forward pass.

**[0:52:55]** And at least all kinds of like strange results

**[0:52:58]** we'll go into some of that in a second as well.

**[0:53:01]** And it leads to a lot of bugs and so on.

**[0:53:04]** And so no one likes this property.

**[0:53:07]** And so people have tried to deprecate

**[0:53:10]** the use of batch normalization

**[0:53:11]** and move to other normalization techniques

**[0:53:12]** that do not couple the examples of a batch.

**[0:53:14]** Examples are layer normalization,

**[0:53:16]** instance normalization, group normalization and so on.

**[0:53:20]** And we'll cover some of these later.

**[0:53:24]** But basically a long story short

**[0:53:25]** batch normalization was the first

**[0:53:27]** kind of normalization layer to be introduced.

**[0:53:29]** It worked extremely well.

**[0:53:30]** It happened to have this regularizing effect.

**[0:53:33]** It stabilized training

**[0:53:35]** and people have been trying to remove it

**[0:53:38]** and move to some of the other normalization techniques.

**[0:53:40]** But it's been hard because it just works quite well.

**[0:53:44]** And some of the reason that it works quite well

**[0:53:46]** is again because of this regularizing effect

**[0:53:48]** and because it is quite effective

**[0:53:50]** at controlling the activations and their distributions.

**[0:53:54]** So that's kind of like the brief story

**[0:53:56]** of batch normalization.

**[0:53:57]** And I'd like to show you one of the other weird

**[0:54:00]** sort of outcomes of this coupling.

**[0:54:03]** So here's one of the strange outcomes

**[0:54:05]** that I only glossed over previously

**[0:54:07]** when I was evaluating the loss on the validation set.

**[0:54:10]** Basically, once we've trained a neural net,

**[0:54:13]** we'd like to deploy it in some kind of a setting

**[0:54:15]** and we'd like to be able to feed in a single

**[0:54:17]** individual example and get a prediction out

**[0:54:19]** from our neural net.

**[0:54:21]** But how do we do that when our neural net now

**[0:54:23]** in a forward pass estimates the statistics

**[0:54:25]** of the mean understanding deviation of a batch?

**[0:54:27]** The neural net expects batches as an input now.

**[0:54:30]** So how do we feed in a single example

**[0:54:32]** and get sensible results out?

**[0:54:34]** And so the proposal in the batch normalization paper

**[0:54:37]** is the following.

**[0:54:38]** What we would like to do here

**[0:54:40]** is we would like to basically have a step after training

**[0:54:44]** that calculates and sets the batch norm mean

**[0:54:48]** and standard deviation a single time

**[0:54:50]** over the training set.

**[0:54:52]** And so I wrote this code here in interest of time

**[0:54:55]** and we're going to call what's called

**[0:54:56]** calibrate the batch norm statistics.

**[0:54:59]** And basically what we do is torch dot no grad

**[0:55:02]** telling PyTorch that none of this

**[0:55:04]** we will call it dot backward on

**[0:55:06]** and it's going to be a bit more efficient.

**[0:55:08]** We're going to take the training set,

**[0:55:10]** get the preactivations for every single training example

**[0:55:13]** and then one single time

**[0:55:14]** estimate the mean and standard deviation

**[0:55:16]** over the entire training set.

**[0:55:18]** And then we're going to get

**[0:55:19]** B and mean and B and standard deviation

**[0:55:20]** and now these are fixed numbers

**[0:55:22]** estimating over the entire training set.

**[0:55:25]** And here instead of estimating it dynamically

**[0:55:29]** we are going to instead here use B and mean

**[0:55:34]** and here we're just going to use B and standard deviation.

**[0:55:38]** And so at test time we are going to fix these

**[0:55:40]** clamp them and use them during inference.

**[0:55:43]** And now you see that we get basically identical result

**[0:55:48]** but the benefit that we've gained

**[0:55:50]** is that we can now also forward a single example

**[0:55:53]** because the mean and standard deviation

**[0:55:54]** are now fixed sort of tensors.

**[0:55:57]** That said, nobody actually wants to estimate

**[0:55:59]** this mean and standard deviation

**[0:56:01]** as a second stage after neural network training

**[0:56:04]** because everyone is lazy.

**[0:56:05]** And so the specialization paper

**[0:56:07]** actually introduced one more idea

**[0:56:09]** which is that we can estimate

**[0:56:11]** the mean and standard deviation

**[0:56:12]** in a running manner during training of the neural net.

**[0:56:17]** And then we can simply just have a single stage

**[0:56:19]** of training and on the side of that training

**[0:56:21]** we are estimating the running mean and standard deviation.

**[0:56:24]** So let's see what that would look like.

**[0:56:26]** Let me basically take the mean here

**[0:56:28]** that we are estimating on the batch

**[0:56:30]** and let me call this B and mean on the I iteration.

**[0:56:35]** And then here this is B and STD.

**[0:56:41]** B and STD and I, okay?

**[0:56:47]** And the mean comes here

**[0:56:50]** and the STD comes here.

**[0:56:53]** So so far I've done nothing.

**[0:56:54]** I've just moved around

**[0:56:55]** and I created these extra variables

**[0:56:56]** for the mean and standard deviation

**[0:56:58]** and I've put them here.

**[0:56:59]** So so far nothing has changed

**[0:57:01]** but what we're going to do now

**[0:57:02]** is we're going to keep a running mean

**[0:57:04]** of both of these values during training.

**[0:57:06]** So let me swing up here

**[0:57:07]** and let me create a B and mean underscore running.

**[0:57:11]** And I'm going to initialize it at zeros

**[0:57:16]** and then B and STD running

**[0:57:18]** which I'll initialize at once

**[0:57:23]** because in the beginning

**[0:57:25]** because of the way we initialized W1 and B1,

**[0:57:29]** each preact will be roughly unit Gaussian.

**[0:57:31]** So the mean will be roughly zero

**[0:57:32]** and the standard deviation roughly one.

**[0:57:34]** So I'm going to initialize these that way

**[0:57:37]** but then here I'm going to update these

**[0:57:39]** and in PyTorch these mean and standard deviation

**[0:57:44]** that are running

**[0:57:45]** they're not actually part

**[0:57:46]** of the gradient based optimization.

**[0:57:47]** We're never going to derive gradients

**[0:57:49]** with respect to them.

**[0:57:50]** They're updated on the side of training.

**[0:57:53]** And so what we're going to do here

**[0:57:54]** is we're going to say with torch dot no grad

**[0:57:58]** telling PyTorch that the update here

**[0:58:00]** is not supposed to be building out a graph

**[0:58:03]** because there will be no dot backward

**[0:58:05]** but this running mean

**[0:58:06]** is basically going to be 0.999 times the current value

**[0:58:13]** plus 0.001 times this value, this new mean.

**[0:58:20]** And in the same way,

**[0:58:21]** the NSTD running will be mostly what it used to be

**[0:58:28]** but it will receive a small update

**[0:58:30]** in the direction of what the current standard deviation is.

**[0:58:35]** And as you're seeing here,

**[0:58:36]** this update is outside and on the side

**[0:58:38]** of the gradient based optimization.

**[0:58:41]** And it's simply being updated

**[0:58:42]** not using gradient descent,

**[0:58:43]** it's just being updated using a janky

**[0:58:46]** like smooth sort of running mean manner.

**[0:58:52]** And so while the network is training

**[0:58:54]** and these pre-activations are sort of changing

**[0:58:57]** and shifting around during back propagation,

**[0:59:00]** we are keeping track of the typical mean

**[0:59:01]** and standard deviation and we're estimating them once.

**[0:59:04]** And when I run this,

**[0:59:07]** now I'm keeping track of this in a running manner.

**[0:59:11]** And what we're hoping for of course

**[0:59:12]** is that the mean mean underscore running

**[0:59:14]** and mean mean underscore STD

**[0:59:17]** are going to be very similar

**[0:59:18]** to the ones that we've calculated here before.

**[0:59:22]** And that way we don't need a second stage

**[0:59:24]** because we've sort of combined the two stages

**[0:59:26]** and we've put them on the side of each other

**[0:59:28]** if you want to look at it that way.

**[0:59:30]** And this is how this is also implemented

**[0:59:32]** in the batch normalization layer in PyTorch.

**[0:59:35]** So during training, the exact same thing will happen

**[0:59:39]** and then later when you're using inference

**[0:59:41]** it will use the estimated running mean

**[0:59:43]** of both the mean and standard deviation

**[0:59:45]** of those hidden states.

**[0:59:47]** So let's wait for the optimization to converge

**[0:59:50]** and hopefully the running mean and standard deviation

**[0:59:52]** are roughly equal to these two.

**[0:59:53]** And then we can simply use it here

**[0:59:55]** and we don't need this stage

**[0:59:57]** of explicit calibration at the end.

**[0:59:59]** Okay, so the optimization finished.

**[1:00:01]** I'll rerun the explicit estimation

**[1:00:03]** and then the BN mean from the explicit estimation is here

**[1:00:07]** and BN mean from the running estimation

**[1:00:11]** during the optimization,

**[1:00:13]** you can see it's very, very similar.

**[1:00:16]** It's not identical, but it's pretty close.

**[1:00:19]** And in the same way, BN STD is this

**[1:00:22]** and BN STD running is this.

**[1:00:26]** As you can see that once again,

**[1:00:27]** they are fairly similar values,

**[1:00:29]** not identical, but pretty close.

**[1:00:31]** And so then here, instead of BN mean,

**[1:00:33]** we can use the BN mean running.

**[1:00:36]** Instead of BN STD, we can use BN STD running.

**[1:00:39]** And hopefully the validation loss

**[1:00:42]** will not be impacted too much.

**[1:00:44]** Okay, so it's basically identical.

**[1:00:46]** And this way we've eliminated the need

**[1:00:49]** for this explicit stage of calibration

**[1:00:51]** because we are doing it in line over here.

**[1:00:54]** Okay, so we're almost done with batch normalization.

**[1:00:56]** There are only two more notes that I'd like to make.

**[1:00:58]** Number one, I've skipped a discussion

**[1:01:00]** over what is this plus epsilon doing here.

**[1:01:02]** This epsilon is usually like some small fixed number,

**[1:01:04]** for example, one negative five by default.

**[1:01:07]** And what it's doing is that

**[1:01:08]** it's basically preventing a division by zero.

**[1:01:10]** In the case that the variance over your batch

**[1:01:14]** is exactly zero.

**[1:01:15]** In that case, here we'd normally have a division by zero,

**[1:01:19]** but because of the plus epsilon,

**[1:01:20]** this is going to become a small number

**[1:01:22]** in the denominator instead,

**[1:01:23]** and things will be more well-behaved.

**[1:01:25]** So feel free to also add a plus epsilon here

**[1:01:28]** of a very small number.

**[1:01:29]** It doesn't actually substantially change the result.

**[1:01:31]** I'm going to skip it in our case

**[1:01:32]** just because this is unlikely to happen

**[1:01:34]** in our very simple example here.

**[1:01:36]** And the second thing I want you to notice

**[1:01:38]** is that we're being wasteful here.

**[1:01:39]** And it's very subtle,

**[1:01:41]** but right here where we are adding the bias

**[1:01:43]** into HP Act.

**[1:01:45]** These biases now are actually useless

**[1:01:48]** because we're adding them to the HP Act,

**[1:01:50]** but then we are calculating the mean

**[1:01:52]** for every one of these neurons and subtracting it.

**[1:01:56]** So whatever bias you add here

**[1:01:58]** is going to get subtracted right here.

**[1:02:00]** And so these biases are not doing anything.

**[1:02:02]** In fact, they're being subtracted out

**[1:02:04]** and they don't impact the rest of the calculation.

**[1:02:07]** So if you look at B1.grad,

**[1:02:08]** it's actually going to be zero

**[1:02:10]** because it's being subtracted out

**[1:02:11]** and doesn't actually have any effect.

**[1:02:13]** And so whenever you're using batch normalization layers,

**[1:02:16]** then if you have any weight layers before,

**[1:02:18]** like a linear or a conv or something like that,

**[1:02:20]** you're better off coming here

**[1:02:22]** and just like not using bias.

**[1:02:24]** So you don't want to use bias.

**[1:02:26]** And then here you don't want to add it

**[1:02:29]** because it's that spurious.

**[1:02:30]** Instead, we have this batch normalization bias here

**[1:02:33]** and that batch normalization bias

**[1:02:35]** is now in charge of the biasing of this distribution

**[1:02:38]** instead of this B1 that we had here originally.

**[1:02:42]** And so basically,

**[1:02:43]** the batch normalization layer has its own bias

**[1:02:45]** and there's no need to have a bias in the layer before it

**[1:02:49]** because that bias is going to be subtracted out anyway.

**[1:02:52]** So that's the other small detail

**[1:02:53]** to be careful with sometimes.

**[1:02:54]** It's not going to do anything catastrophic.

**[1:02:56]** This B1 will just be useless.

**[1:02:58]** It will never get any gradient.

**[1:03:00]** It will not learn.

**[1:03:01]** It will stay constant and it's just wasteful

**[1:03:03]** but it doesn't actually really impact anything otherwise.

**[1:03:07]** Okay, so I rearranged the code a little bit

**[1:03:08]** with comments and I just wanted to give

**[1:03:10]** a very quick summary of the batch normalization layer.

**[1:03:13]** We are using batch normalization

**[1:03:15]** to control the statistics of activations in the neural net.

**[1:03:19]** It is common to sprinkle batch normalization layer

**[1:03:22]** across the neural net

**[1:03:23]** and usually we will place it after layers

**[1:03:26]** that have multiplications

**[1:03:27]** like for example, a linear layer

**[1:03:29]** or a convolutional layer

**[1:03:30]** which we may cover in the future.

**[1:03:33]** Now the batch normalization internally

**[1:03:35]** has parameters for the gain and the bias

**[1:03:39]** and these are trained using back propagation.

**[1:03:41]** It also has two buffers.

**[1:03:44]** The buffers are the mean and the standard deviation,

**[1:03:47]** the running mean and the running mean

**[1:03:49]** of the standard deviation.

**[1:03:50]** And these are not trained using back propagation.

**[1:03:52]** These are trained using this janky update

**[1:03:55]** of kind of like a running mean update.

**[1:03:58]** So these are sort of the parameters

**[1:04:02]** and the buffers of batch normalization layer.

**[1:04:05]** And then really what it's doing is

**[1:04:06]** it's calculating the mean and the standard deviation

**[1:04:08]** of the activations that are feeding

**[1:04:11]** into the batch normalization layer over that batch.

**[1:04:14]** Then it's centering that batch to be unit Gaussian

**[1:04:18]** and then it's offsetting and scaling it

**[1:04:20]** by the learned bias and gain.

**[1:04:24]** And then on top of that,

**[1:04:25]** it's keeping track of the mean and standard deviation

**[1:04:27]** of the inputs

**[1:04:29]** and it's maintaining this running mean and standard deviation.

**[1:04:32]** And this will later be used at inference

**[1:04:35]** so that we don't have to re-estimate

**[1:04:36]** the mean and standard deviation all the time.

**[1:04:39]** And in addition, that allows us

**[1:04:40]** to basically forward individual examples at test time.

**[1:04:44]** So that's the batch normalization layer.

**[1:04:45]** It's a fairly complicated layer

**[1:04:48]** but this is what it's doing internally.

**[1:04:50]** Now I wanted to show you a little bit of a real example.

**[1:04:53]** So you can search ResNet

**[1:04:55]** which is a residual neural network

**[1:04:57]** and these are contacted neural networks

**[1:04:59]** used for image classification.

**[1:05:02]** And of course we haven't come to ResNets in detail

**[1:05:04]** so I'm not going to explain all the pieces of it.

**[1:05:07]** But for now, just note that the image feeds

**[1:05:10]** into a ResNet on the top here

**[1:05:12]** and there's many, many layers with repeating structure

**[1:05:15]** all the way to predictions of what's inside that image.

**[1:05:18]** This repeating structure is made up of these blocks

**[1:05:20]** and these blocks are just sequentially stacked up

**[1:05:23]** in this deep neural network.

**[1:05:25]** Now the code for this, the block basically that's used

**[1:05:29]** and repeated sequentially in series

**[1:05:32]** is called this bottleneck block.

**[1:05:36]** And there's a lot here, this is all PyTorch

**[1:05:38]** and of course we haven't covered all of it

**[1:05:40]** but I want to point out some small pieces of it.

**[1:05:43]** Here in the init is where we initialize the neural net.

**[1:05:45]** So this code of block here

**[1:05:47]** is basically the kind of stuff we're doing here.

**[1:05:48]** We're initializing all the layers

**[1:05:51]** and in the forward we are specifying

**[1:05:53]** how the neural net acts once you actually have the input.

**[1:05:55]** So this code here is along the lines

**[1:05:57]** of what we're doing here.

**[1:06:01]** And now these blocks are replicated and stacked up serially

**[1:06:05]** and that's what a residual network would be.

**[1:06:08]** And so notice what's happening here.

**[1:06:10]** Comm one, these are convolutional layers.

**[1:06:14]** And these convolutional layers basically

**[1:06:16]** they're the same thing as a linear layer

**[1:06:19]** except convolutional layers don't apply,

**[1:06:22]** convolutional layers are used for images.

**[1:06:24]** And so they have spatial structure

**[1:06:26]** and basically this linear multiplication and bias offset

**[1:06:29]** are done on patches instead of the full input.

**[1:06:34]** So because these images have structure, spatial structure,

**[1:06:37]** convolutions just basically do WX plus B

**[1:06:40]** but they do it on overlapping patches of the input.

**[1:06:44]** But otherwise it's WX plus B.

**[1:06:46]** Then we have the normal layer

**[1:06:48]** which by default here is initialized to be a batch norm

**[1:06:50]** and 2D, so two dimensional batch normalization layer.

**[1:06:54]** And then we have a nonlinearity like ReLU.

**[1:06:56]** So instead of here they use ReLU,

**[1:06:59]** we are using 10H in this case.

**[1:07:02]** But both are just nonlinearities

**[1:07:04]** and you can just use them relatively interchangeably

**[1:07:07]** for very deep networks ReLU's typically empirically

**[1:07:10]** work a bit better.

**[1:07:11]** So see the motif that's being repeated here.

**[1:07:14]** We have convolution, batch normalization, ReLU,

**[1:07:16]** convolution, batch normalization, ReLU, et cetera.

**[1:07:19]** And then here this is residual connection

**[1:07:21]** that we haven't covered yet.

**[1:07:23]** But basically that's the exact same pattern we have here.

**[1:07:25]** We have a weight layer like a convolution

**[1:07:28]** or like a linear layer, batch normalization

**[1:07:32]** and then 10H which is nonlinearity.

**[1:07:35]** But basically a weight layer,

**[1:07:37]** a normalization layer and nonlinearity.

**[1:07:39]** And that's the motif that you would be stacking up

**[1:07:41]** when you create these deep neural networks

**[1:07:43]** exactly as it's done here.

**[1:07:45]** And one more thing I'd like you to notice

**[1:07:47]** is that here when they are initializing the comm layers

**[1:07:50]** like comm one by one, the depth for that is right here.

**[1:07:54]** And so it's initializing an nn.conf2D

**[1:07:56]** which is a convolutional layer in PyTorch.

**[1:07:59]** And there's a bunch of keyword arguments here

**[1:08:00]** that I'm not gonna explain yet.

**[1:08:02]** But you see how there's bias equals false?

**[1:08:04]** The bias equals false is exactly for the same reason

**[1:08:07]** as bias is not used in our case.

**[1:08:10]** You see how I raised the use of bias

**[1:08:12]** and the use of bias is spurious

**[1:08:13]** because after this weight layer, there's a batch normalization

**[1:08:16]** and the batch normalization subtracts that bias

**[1:08:19]** and then has its own bias.

**[1:08:20]** So there's no need to introduce

**[1:08:21]** these spurious parameters.

**[1:08:23]** It wouldn't hurt performance, it's just useless.

**[1:08:25]** And so because they have this motif

**[1:08:27]** of comm, batch, and ReLU,

**[1:08:29]** they don't need a bias here

**[1:08:31]** because there's a bias inside here.

**[1:08:33]** So by the way, this example here is very easy to find.

**[1:08:37]** Just do ResNet PyTorch and it's this example here.

**[1:08:41]** So this is kind of like the stock implementation

**[1:08:43]** of a residual neural network in PyTorch

**[1:08:46]** and you can find that here.

**[1:08:48]** But of course I haven't covered many of these parts yet.

**[1:08:50]** And I would also like to briefly descend

**[1:08:52]** into the definitions of these PyTorch layers

**[1:08:55]** and the parameters that they take.

**[1:08:57]** Now instead of a convolutional layer,

**[1:08:58]** we're going to look at a linear layer

**[1:09:01]** because that's the one that we're using here.

**[1:09:02]** This is a linear layer

**[1:09:03]** and I haven't covered convolutions yet.

**[1:09:06]** But as I mentioned,

**[1:09:07]** convolutions are basically linear layers except on patches.

**[1:09:11]** So a linear layer performs a WX plus B

**[1:09:14]** except here they're calling the WA transpose.

**[1:09:18]** So the clock is WX plus B very much like we did here.

**[1:09:21]** To initialize this layer, you need to know the fan in,

**[1:09:24]** the fan out and that's so that they can initialize this W.

**[1:09:29]** This is the fan in and the fan out.

**[1:09:32]** So they know how big the weight matrix should be.

**[1:09:35]** You need to also pass in whether or not you want a bias

**[1:09:39]** and if you set it to false,

**[1:09:40]** then no bias will be inside this layer

**[1:09:44]** and you may want to do that exactly like in our case

**[1:09:47]** if your layer is followed by a normalization layer

**[1:09:49]** such as batch norm.

**[1:09:51]** So this allows you to basically disable bias.

**[1:09:54]** And in terms of the initialization, if we swing down here,

**[1:09:57]** this is reporting the variables used inside this linear layer

**[1:10:00]** and our linear layer here has two parameters,

**[1:10:04]** the weight and the bias.

**[1:10:05]** In the same way, they have a weight and a bias

**[1:10:08]** and they're talking about how they initialize it by default.

**[1:10:11]** So by default, PyTorch will initialize your weights

**[1:10:14]** by taking the fan in

**[1:10:16]** and then doing one over fan in square root.

**[1:10:20]** And then instead of a normal distribution,

**[1:10:23]** they are using a uniform distribution.

**[1:10:25]** So it's very much the same thing,

**[1:10:27]** but they are using a one instead of five over three.

**[1:10:30]** So there's no gain being calculated here.

**[1:10:32]** The gain is just one,

**[1:10:33]** but otherwise it's exactly one over the square root

**[1:10:37]** of fan in exactly as we have here.

**[1:10:40]** So one over the square root of K

**[1:10:42]** is the scale of the weights,

**[1:10:45]** but when they are drawing the numbers,

**[1:10:46]** they're not using a Gaussian by default,

**[1:10:48]** they're using a uniform distribution by default.

**[1:10:51]** And so they draw uniformly from negative square root of K

**[1:10:54]** to square root of K,

**[1:10:56]** but it's the exact same thing and the same motivation

**[1:10:58]** from with respect to what we've seen in this lecture.

**[1:11:03]** And the reason they're doing this is

**[1:11:04]** if you have a roughly Gaussian input,

**[1:11:06]** this will ensure that out of this layer,

**[1:11:09]** you will have a roughly Gaussian output

**[1:11:11]** and you basically achieve that by scaling the weights

**[1:11:15]** by one over the square root of fan in.

**[1:11:17]** So that's what this is doing.

**[1:11:20]** And then the second thing is the batch normalization layer.

**[1:11:23]** So let's look at what that looks like in PyTorch.

**[1:11:26]** So here we have a one dimensional batch normalization layer

**[1:11:28]** exactly as we are using here.

**[1:11:30]** And there are a number of keyword arguments

**[1:11:32]** going into it as well.

**[1:11:33]** So we need to know the number of features

**[1:11:35]** for us that is 200 and that is needed

**[1:11:38]** so that we can initialize these parameters here.

**[1:11:40]** The gain, the bias and the buffers

**[1:11:43]** for the running mean and standard deviation.

**[1:11:46]** Then they need to know the value of epsilon here.

**[1:11:49]** And by default, this is one negative five.

**[1:11:51]** You don't typically change this too much.

**[1:11:53]** Then they need to know the momentum.

**[1:11:55]** And the momentum here, as they explain,

**[1:11:58]** is basically used for these running mean

**[1:12:01]** and running standard deviation.

**[1:12:02]** So by default, the momentum here is 0.1.

**[1:12:05]** The momentum we are using here in this example

**[1:12:07]** is 0.001.

**[1:12:09]** And basically you may want to change this sometimes

**[1:12:13]** and roughly speaking, if you have a very large batch size,

**[1:12:17]** then typically what you'll see is that when you estimate

**[1:12:19]** the mean and standard deviation,

**[1:12:21]** for every single batch size, if it's large enough,

**[1:12:23]** you're going to get roughly the same result.

**[1:12:26]** And so therefore you can use

**[1:12:28]** slightly higher momentum like 0.1.

**[1:12:31]** But for batch size as small as 32,

**[1:12:34]** the mean and standard deviation here

**[1:12:36]** might take on slightly different numbers

**[1:12:37]** because there's only 32 examples we are using

**[1:12:39]** to estimate the mean and standard deviation.

**[1:12:41]** So the value is changing around a lot.

**[1:12:44]** And if your momentum is 0.1,

**[1:12:46]** that might not be good enough for this value to settle

**[1:12:49]** and converge to the actual mean and standard deviation

**[1:12:53]** over the entire training set.

**[1:12:55]** And so basically if your batch size is very small,

**[1:12:57]** momentum of 0.1 is potentially dangerous

**[1:12:59]** and it might make it so that the running mean

**[1:13:02]** and standard deviation is thrashing too much

**[1:13:04]** during training and it's not actually converging properly.

**[1:13:09]** Affine equals true determines

**[1:13:11]** whether this batch normalization layer

**[1:13:13]** has these learnable affine parameters,

**[1:13:15]** the gain and the bias.

**[1:13:18]** And this is almost always kept to true.

**[1:13:20]** I'm not actually sure why you would wanna change this to false.

**[1:13:26]** Then track running stats is determining whether or not

**[1:13:29]** batch normalization layer of PyTorch will be doing this.

**[1:13:32]** And one reason you may wanna skip the running stats

**[1:13:37]** is because you may want to, for example,

**[1:13:39]** estimate them at the end as a stage two like this.

**[1:13:43]** And in that case, you don't want the batch normalization layer

**[1:13:45]** to be doing all this extra compute

**[1:13:46]** that you're not gonna use.

**[1:13:48]** And finally, we need to know which device

**[1:13:51]** we're gonna run this batch normalization on,

**[1:13:53]** a CPU or a GPU,

**[1:13:55]** and what the data type should be.

**[1:13:56]** Half precision, single precision,

**[1:13:58]** double precision, and so on.

**[1:14:01]** So that's the batch normalization layer.

**[1:14:02]** Otherwise, they link to the paper.

**[1:14:03]** It's the same formula we implemented

**[1:14:06]** and everything is the same exactly as we've done here.

**[1:14:10]** Okay, so that's everything

**[1:14:11]** that I wanted to cover for this lecture.

**[1:14:13]** Really what I wanted to talk about

**[1:14:14]** is the importance of understanding the activations

**[1:14:17]** and the gradients and their statistics in neural networks.

**[1:14:20]** And this becomes increasingly important,

**[1:14:22]** especially as you make your neural networks bigger,

**[1:14:23]** larger, and deeper.

**[1:14:25]** We looked at the distributions basically

**[1:14:27]** at the output layer.

**[1:14:28]** And we saw that if you have two confident mispredictions

**[1:14:31]** because the activations are too messed up

**[1:14:33]** at the last layer,

**[1:14:35]** you can end up with these hockey stick losses.

**[1:14:37]** And if you fix this,

**[1:14:38]** you get a better loss at the end of training

**[1:14:40]** because your training is not doing wasteful work.

**[1:14:44]** Then we also saw that we need to control the activations.

**[1:14:46]** We don't want them to squash to zero

**[1:14:49]** or explode to infinity.

**[1:14:50]** And because that you can run into a lot of trouble

**[1:14:52]** with all of these nonlinearities in these neural nets.

**[1:14:55]** And basically you want everything

**[1:14:56]** to be fairly homogeneous throughout the neural net.

**[1:14:58]** You want roughly Gaussian activations

**[1:15:00]** throughout the neural net.

**[1:15:02]** Then we talked about, okay,

**[1:15:04]** if we would roughly Gaussian activations,

**[1:15:06]** how do we scale these weight matrices and biases

**[1:15:09]** during initialization of the neural net

**[1:15:11]** so that we don't get, you know,

**[1:15:13]** so everything is as controlled as possible?

**[1:15:17]** So that gave us a large boost in improvement.

**[1:15:19]** And then I talked about how that strategy

**[1:15:22]** is not actually possible for much, much deeper neural nets.

**[1:15:27]** Because when you have much deeper neural nets

**[1:15:30]** with lots of different types of layers,

**[1:15:32]** it becomes really, really hard

**[1:15:33]** to precisely set the weights and the biases

**[1:15:36]** in such a way that the activations

**[1:15:38]** are roughly uniform throughout the neural net.

**[1:15:41]** So then I introduced the notion of a normalization layer.

**[1:15:44]** Now there are many normalization layers

**[1:15:45]** that people use in practice,

**[1:15:47]** batch normalization, layer normalization,

**[1:15:50]** distance normalization, group normalization.

**[1:15:52]** We haven't covered most of them,

**[1:15:54]** but I've introduced the first one.

**[1:15:55]** And also the one that I believe came out first

**[1:15:58]** and that's called batch normalization.

**[1:16:00]** And we saw how batch normalization works.

**[1:16:02]** This is a layer that you can sprinkle

**[1:16:04]** throughout your deep neural net.

**[1:16:06]** And the basic idea is if you want

**[1:16:08]** roughly Gaussian activations,

**[1:16:10]** well then take your activations

**[1:16:11]** and take the mean and the standard deviation

**[1:16:14]** and center your data.

**[1:16:16]** And you can do that because the centering operation

**[1:16:19]** is differentiable.

**[1:16:21]** But on top of that,

**[1:16:22]** we actually had to add a lot of bells and whistles.

**[1:16:25]** And that gave you a sense of the complexities

**[1:16:27]** of the batch normalization layer.

**[1:16:28]** Because now we're centering the data, that's great.

**[1:16:30]** But suddenly we need the gain and the bias.

**[1:16:33]** And now those are trainable.

**[1:16:35]** And then because we are coupling all of the training examples,

**[1:16:38]** now suddenly the question is how do you do the inference?

**[1:16:41]** Where to do the inference,

**[1:16:42]** we need to now estimate these mean and standard deviation

**[1:16:47]** once over the entire training set

**[1:16:49]** and then use those at inference.

**[1:16:51]** But then no one likes to do stage two.

**[1:16:53]** So instead we fold everything into

**[1:16:55]** the batch normalization layer during training

**[1:16:57]** and try to estimate these in a running manner

**[1:17:00]** so that everything is a bit simpler.

**[1:17:02]** And that gives us the batch normalization layer.

**[1:17:06]** And as I mentioned, no one likes this layer.

**[1:17:09]** It causes a huge amount of bugs.

**[1:17:12]** And intuitively it's because it is coupling examples

**[1:17:16]** in the forward pass of the neural net.

**[1:17:18]** And I've shot myself in the foot with this layer

**[1:17:23]** over and over again in my life

**[1:17:25]** and I don't want you to suffer the same.

**[1:17:28]** So basically try to avoid it as much as possible.

**[1:17:32]** Some of the other alternatives to these layers

**[1:17:33]** are for example group normalization or layer normalization

**[1:17:36]** and those have become more common

**[1:17:38]** in more recent deep learning

**[1:17:40]** but we haven't covered those yet.

**[1:17:43]** But definitely batch normalization was very influential

**[1:17:45]** at the time when it came out in roughly 2015

**[1:17:48]** because it was kind of the first time

**[1:17:50]** that you could train reliably much deeper neural nets.

**[1:17:55]** And fundamentally the reason for that is

**[1:17:56]** because this layer was very effective

**[1:17:59]** at controlling the statistics

**[1:18:00]** of the activations in a neural net.

**[1:18:03]** So that's the story so far

**[1:18:05]** and that's all I wanted to cover.

**[1:18:07]** And in the future lecture,

**[1:18:08]** hopefully we can start going into recurring neural nets

**[1:18:11]** and recurring neural nets as we'll see

**[1:18:14]** are just very, very deep networks

**[1:18:16]** because you unroll the loop

**[1:18:18]** and when you actually optimize these neural nets.

**[1:18:21]** And that's where a lot of this analysis

**[1:18:25]** around the activation statistics

**[1:18:27]** and all these normalization layers

**[1:18:29]** will become very, very important for a good performance.

**[1:18:32]** So we'll see that next time, bye.

**[1:18:35]** Okay, so I lied.

**[1:18:36]** I would like us to do one more summary here as a bonus

**[1:18:39]** and I think it's useful as to have one more summary

**[1:18:41]** of everything I've presented in this lecture

**[1:18:43]** but also I would like us to start

**[1:18:45]** by torturing our code a little bit.

**[1:18:47]** So it looks much more like

**[1:18:48]** what you would encounter in PyTorch.

**[1:18:50]** So you'll see that I will structure our code

**[1:18:52]** into these modules like a linear module

**[1:18:56]** and a bachelor module.

**[1:18:58]** And I'm putting the code inside these modules

**[1:19:01]** so that we can construct neural networks very much

**[1:19:03]** like we would construct them in PyTorch

**[1:19:04]** and I will go through this in detail.

**[1:19:06]** So we'll create our neural net

**[1:19:08]** then we will do the optimization loop as we did before.

**[1:19:12]** And then the one more thing that I want to do here

**[1:19:14]** is I want to look at the activation statistics

**[1:19:16]** both in the forward pass and in the backward pass.

**[1:19:19]** And then here we have the evaluation

**[1:19:20]** and sampling just like before.

**[1:19:23]** So let me rewind all the way up here

**[1:19:24]** and go a little bit slower.

**[1:19:26]** So here I am creating a linear layer.

**[1:19:29]** You'll notice that torch.nn has lots

**[1:19:31]** of different types of layers

**[1:19:32]** and one of those layers is the linear layer.

**[1:19:35]** Torch.nn.linear takes number of input features,

**[1:19:37]** output features, whether or not we should have bias

**[1:19:40]** and then the device that we want to place this layer on

**[1:19:42]** and the data type.

**[1:19:43]** So I will omit these two

**[1:19:45]** but otherwise we have the exact same thing.

**[1:19:48]** We have the fan in which is the number of inputs fan out

**[1:19:51]** the number of outputs

**[1:19:53]** and whether or not we want to use a bias

**[1:19:55]** and internally inside this layer

**[1:19:56]** there's a weight and a bias if you'd like it.

**[1:19:59]** It is typical to initialize the weight

**[1:20:02]** using say random numbers drawn from a Gaussian

**[1:20:06]** and then here's the coming initialization

**[1:20:08]** that we discussed already in this lecture

**[1:20:10]** and that's a good default

**[1:20:12]** and also the default that I believe PyTorch uses

**[1:20:14]** and by default the bias is usually initialized to zeros.

**[1:20:18]** Now when you call this module,

**[1:20:20]** this will basically calculate W times X plus B

**[1:20:23]** if you have NB

**[1:20:24]** and then when you also call that parameters on this module

**[1:20:27]** it will return the tensors

**[1:20:29]** that are the parameters of this layer.

**[1:20:32]** Now next we have the batch normalization layer.

**[1:20:34]** So I've written that here

**[1:20:37]** and this is very similar to PyTorch.nn.bashnorm1d layer

**[1:20:42]** as shown here.

**[1:20:44]** So I'm kind of taking these three parameters here

**[1:20:48]** the dimensionality, the epsilon that we'll use in the division

**[1:20:51]** and the momentum that we will use

**[1:20:53]** in keeping track of these running stats,

**[1:20:55]** the running mean and the running variance.

**[1:20:58]** Now PyTorch actually takes quite a few more things

**[1:21:00]** but I'm assuming some of their settings.

**[1:21:02]** So for us, Alphine will be true

**[1:21:03]** that means that we will be using a gamma and beta

**[1:21:06]** after the normalization.

**[1:21:08]** The track running stats will be true

**[1:21:09]** so we will be keeping track of the running mean

**[1:21:11]** and the running variance in the batch norm.

**[1:21:14]** Our device by default is the CPU

**[1:21:17]** and the data type by default is Float32.

**[1:21:22]** So those are the defaults

**[1:21:23]** otherwise we are taking all the same parameters

**[1:21:26]** in this batch norm layer.

**[1:21:27]** So first I'm just saving them.

**[1:21:30]** Now here's something new.

**[1:21:31]** There's a dot training which by default is true

**[1:21:33]** and PyTorch.nn modules also have this attribute dot training

**[1:21:37]** and that's because many modules

**[1:21:38]** and batch norm is included in that

**[1:21:41]** have a different behavior

**[1:21:42]** whether you are training your normalization

**[1:21:45]** or whether you are running it in an evaluation mode

**[1:21:47]** and calculating your evaluation laws

**[1:21:49]** or using it for inference on some test examples.

**[1:21:52]** And batch norm is an example of this

**[1:21:54]** because when we are training

**[1:21:56]** we are going to be using the mean and the variance

**[1:21:57]** estimated from the current batch

**[1:21:59]** but during inference

**[1:22:01]** we are using the running mean and running variance

**[1:22:04]** and so also if we are training

**[1:22:06]** we are updating mean and variance

**[1:22:07]** but if we are testing

**[1:22:08]** then these are not being updated they are kept fixed.

**[1:22:11]** And so this flag is necessary

**[1:22:13]** and by default true just like in PyTorch.

**[1:22:16]** Now the parameters of batch norm 1D

**[1:22:17]** are the gamma and the beta here

**[1:22:21]** and then the running mean and the running variance

**[1:22:23]** are called buffers in PyTorch nomenclature

**[1:22:27]** and these buffers are trained

**[1:22:30]** using exponential moving average here explicitly

**[1:22:33]** and they are not part of the back propagation

**[1:22:35]** and stochastic gradient descent.

**[1:22:37]** So they are not sort of like parameters of this layer

**[1:22:39]** and that's why when we have a parameters here

**[1:22:42]** we only return gamma and beta

**[1:22:44]** we do not return the mean and the variance

**[1:22:46]** this is trained sort of like internally

**[1:22:48]** here every forward pass

**[1:22:51]** using exponential moving average.

**[1:22:54]** So that's the initialization.

**[1:22:56]** Now in a forward pass

**[1:22:58]** if we are training

**[1:22:59]** then we use the mean and the variance

**[1:23:01]** estimated by the batch.

**[1:23:03]** I'll upload the paper here.

**[1:23:05]** We calculate the mean and the variance

**[1:23:08]** now up above I was estimating the standard deviation

**[1:23:12]** and keeping track of the standard deviation

**[1:23:14]** here in the running standard deviation

**[1:23:16]** instead of running variance.

**[1:23:18]** But let's follow the paper exactly.

**[1:23:20]** Here they calculate the variance

**[1:23:22]** which is the standard deviation squared

**[1:23:23]** and that's what's kept track of

**[1:23:25]** in the running variance

**[1:23:26]** instead of the running standard deviation.

**[1:23:29]** But those two would be very, very similar I believe.

**[1:23:33]** If we are not training

**[1:23:34]** then we use the running mean and variance

**[1:23:36]** we normalize

**[1:23:39]** and then here I'm calculating the output of this layer

**[1:23:42]** and I'm also assigning it to an attribute called dot out.

**[1:23:45]** Now dot out is something that I'm using in our modules here.

**[1:23:49]** This is not what you would find in PyTorch

**[1:23:51]** we are slightly deviating from it.

**[1:23:53]** I'm creating a dot out

**[1:23:54]** because I would like to very easily

**[1:23:57]** maintain all those variables

**[1:23:58]** so that we can create statistics of them and plot them.

**[1:24:01]** But PyTorch and modules

**[1:24:02]** will not have a dot out attribute.

**[1:24:05]** And finally here we are updating the buffers

**[1:24:07]** using again as I mentioned exponential moving average

**[1:24:11]** given the provided momentum.

**[1:24:13]** And importantly you'll notice that

**[1:24:14]** I'm using the torched up no grad context manager.

**[1:24:17]** And I'm doing this because if we don't use this

**[1:24:19]** then PyTorch will start building out

**[1:24:21]** an entire computational graph out of these tensors

**[1:24:24]** because it is expecting

**[1:24:25]** that we will eventually call a dot backward.

**[1:24:28]** But we are never gonna be calling dot backward

**[1:24:29]** on anything that includes running mean

**[1:24:31]** and running variance.

**[1:24:32]** So that's why we need to use this context manager

**[1:24:35]** so that we are not sort of maintaining them

**[1:24:37]** using all this additional memory.

**[1:24:40]** So this will make it more efficient.

**[1:24:42]** And it's just telling PyTorch that there will be no backward.

**[1:24:44]** We just have a bunch of tensors,

**[1:24:45]** we want to update them, that's it.

**[1:24:47]** And then we return.

**[1:24:50]** Okay, now scrolling down, we have the 10H layer.

**[1:24:52]** This is very, very similar to torched dot 10H.

**[1:24:56]** And it doesn't do too much,

**[1:24:57]** it just calculates 10H as you might expect.

**[1:25:00]** So that's torched dot 10H

**[1:25:02]** and there's no parameters in this layer.

**[1:25:05]** But because these are layers,

**[1:25:07]** it now becomes very easy to sort of like

**[1:25:09]** stack them up into basically just a list.

**[1:25:13]** And we can do all the initializations that we're used to.

**[1:25:16]** So we have the initial sort of embedding matrix,

**[1:25:19]** we have our layers and we can call them sequentially.

**[1:25:22]** And then again, with torched dot no grad,

**[1:25:24]** there's some initializations here.

**[1:25:26]** So we want to make the output softmax

**[1:25:28]** a bit less confident like we saw.

**[1:25:30]** And in addition to that,

**[1:25:31]** because we are using a six layer

**[1:25:33]** multi-layer perceptron here.

**[1:25:34]** So you see how I'm stacking linear 10H,

**[1:25:37]** linear 10H, et cetera.

**[1:25:39]** I'm going to be using the game here.

**[1:25:41]** And I'm going to play with this in a second.

**[1:25:42]** So you'll see how when we change this,

**[1:25:44]** what happens to the statistics.

**[1:25:47]** Finally, the parameters are basically the embedding matrix

**[1:25:49]** and all the parameters in all the layers.

**[1:25:52]** And notice here, I'm using a double list comprehension,

**[1:25:55]** if you want to call it that,

**[1:25:56]** but for every layer in layers

**[1:25:58]** and for every parameter in each of those layers,

**[1:26:00]** we are just stacking up all those piece,

**[1:26:03]** all those parameters.

**[1:26:05]** Now in total, we have 46,000 parameters.

**[1:26:09]** And I'm telling PyTorch that all of them require gradient.

**[1:26:16]** Then here, we have everything here,

**[1:26:18]** we are actually mostly used to.

**[1:26:20]** We are sampling batch.

**[1:26:22]** We are doing forward pass.

**[1:26:23]** The forward pass now is just the linear application

**[1:26:25]** of all the layers in order,

**[1:26:27]** followed by the cross entropy.

**[1:26:29]** And then in the backward pass,

**[1:26:30]** you'll notice that for every single layer,

**[1:26:32]** I now iterate over all the outputs.

**[1:26:34]** And I'm telling PyTorch to retain the gradient of them.

**[1:26:37]** And then here we are already used to

**[1:26:39]** all the gradients set to none.

**[1:26:41]** Do the backward to fill in the gradients,

**[1:26:43]** do an update using stochastic gradient send,

**[1:26:46]** and then track some statistics.

**[1:26:48]** And then I am going to break after a single iteration.

**[1:26:52]** Now here in this cell, in this diagram,

**[1:26:54]** I'm visualizing the histograms of the forward pass

**[1:26:57]** activations, and I'm specifically doing it

**[1:27:00]** at the 10H layers.

**[1:27:01]** So iterating over all the layers,

**[1:27:04]** except for the very last one,

**[1:27:05]** which is basically just the softmax layer.

**[1:27:09]** If it is a 10H layer,

**[1:27:11]** and I'm using a 10H layer just because

**[1:27:13]** they have a finite output, negative one to one,

**[1:27:15]** and so it's very easy to visualize here.

**[1:27:17]** So you see negative one to one,

**[1:27:18]** and it's a finite range and easy to work with.

**[1:27:21]** I take the out tensor from that layer into T,

**[1:27:25]** and then I'm calculating the mean,

**[1:27:27]** the standard deviation, and the percent saturation of T.

**[1:27:30]** And the way I define the percent saturation

**[1:27:32]** is that T dot absolute value is greater than 0.97.

**[1:27:35]** So that means we are here at the tails of the 10H.

**[1:27:38]** And remember that when we are in the tails of the 10H,

**[1:27:41]** that will actually stop gradients.

**[1:27:42]** So we don't want this to be too high.

**[1:27:45]** Now here I'm calling tors.histogram,

**[1:27:49]** and then I am plotting this histogram.

**[1:27:51]** So basically what this is doing is that

**[1:27:52]** every different type of layer,

**[1:27:54]** and they all have a different color,

**[1:27:55]** we are looking at how many values in these testers

**[1:27:59]** take on any of the values below on this axis here.

**[1:28:04]** So the first layer is fairly saturated here at 20%.

**[1:28:08]** So you can see that it's got tails here,

**[1:28:10]** but then everything sort of stabilizes.

**[1:28:12]** And if we had more layers here,

**[1:28:13]** it would actually just stabilize

**[1:28:15]** at around the standard deviation of about 0.65,

**[1:28:18]** and the saturation would be roughly 5%.

**[1:28:20]** And the reason that this stabilizes

**[1:28:22]** and gives us a nice distribution here

**[1:28:24]** is because gain is set to five over three.

**[1:28:27]** Now here, this gain,

**[1:28:30]** you see that by default we initialize

**[1:28:33]** with one over square root of fan in.

**[1:28:35]** But then here during initialization,

**[1:28:36]** I come in and I iterate over all the layers.

**[1:28:38]** And if it's a linear layer, I boost that by the gain.

**[1:28:42]** Now we saw that one,

**[1:28:44]** so basically if we just do not use a gain,

**[1:28:47]** then what happens?

**[1:28:48]** If I redraw this,

**[1:28:50]** you will see that the standard deviation is shrinking,

**[1:28:54]** and the saturation is coming to zero.

**[1:28:57]** And basically what's happening

**[1:28:58]** is the first layer is pretty decent,

**[1:29:00]** but then further layers are just kind of like

**[1:29:03]** shrinking down to zero.

**[1:29:05]** And it's happening slowly, but it's shrinking to zero.

**[1:29:07]** And the reason for that is

**[1:29:09]** when you just have a sandwich of linear layers alone,

**[1:29:13]** then initializing our weights in this manner,

**[1:29:17]** we saw previously would have conserved

**[1:29:20]** the standard deviation of one.

**[1:29:22]** But because we have this interspersed

**[1:29:24]** 10-inch layers in there,

**[1:29:26]** these 10-inch layers are squashing functions.

**[1:29:29]** And so they take your distribution

**[1:29:31]** and they slightly squash it.

**[1:29:32]** And so some gain is necessary to keep expanding it

**[1:29:37]** to fight the squashing.

**[1:29:40]** So it just turns out that five over three is a good value.

**[1:29:43]** So if we have something too small, like one,

**[1:29:45]** we saw that things will come towards zero.

**[1:29:49]** But if it's something too high, let's do two.

**[1:29:52]** Then here we see that,

**[1:29:56]** well, let me do something a bit more extreme

**[1:29:58]** because so it's a bit more visible.

**[1:30:00]** Let's try three.

**[1:30:02]** Okay, so we see here that the saturations

**[1:30:04]** are trying to be way too large.

**[1:30:06]** Okay, so three would create way too saturated activations.

**[1:30:10]** So five over three is a good setting

**[1:30:13]** for a sandwich of linear layers with 10-inch activations.

**[1:30:17]** And it roughly stabilizes the standard deviation

**[1:30:20]** at a reasonable point.

**[1:30:22]** Now, honestly, I have no idea

**[1:30:24]** where five over three came from in PyTorch

**[1:30:27]** when we were looking at the coming initialization.

**[1:30:30]** I see empirically that it stabilizes this sandwich

**[1:30:32]** of linear and 10-inch

**[1:30:34]** and that the saturation is in a good range.

**[1:30:36]** But I don't actually know if this came out

**[1:30:38]** of some math formula.

**[1:30:39]** I tried searching briefly for where this comes from,

**[1:30:42]** but I wasn't able to find anything.

**[1:30:44]** But certainly we see that empirically

**[1:30:46]** these are very nice ranges.

**[1:30:47]** Our saturation is roughly 5%,

**[1:30:49]** which is a pretty good number.

**[1:30:50]** And this is a good setting of the gain in this context.

**[1:30:55]** Similarly, we can do the exact same thing

**[1:30:57]** with the gradients.

**[1:30:58]** So here is a very same loop if it's a 10-inch,

**[1:31:01]** but instead of taking the layer that out,

**[1:31:03]** I'm taking the grad.

**[1:31:04]** And then I'm also showing the mean and standard deviation

**[1:31:07]** and I'm plotting the histogram of these values.

**[1:31:10]** And so you'll see that the gradient distribution

**[1:31:11]** is fairly reasonable.

**[1:31:13]** And in particular, what we're looking for

**[1:31:14]** is that all the different layers in this sandwich

**[1:31:17]** has roughly the same gradient.

**[1:31:19]** Things are not shrinking or exploding.

**[1:31:22]** So we can, for example, come here

**[1:31:24]** and we can take a look at what happens

**[1:31:25]** if this gain was way too small.

**[1:31:27]** So this was 0.5.

**[1:31:30]** Then you see the, first of all,

**[1:31:32]** the activations are shrinking to zero,

**[1:31:34]** but also the gradients are doing something weird.

**[1:31:36]** The gradients started out here

**[1:31:38]** and then now they're like expanding out.

**[1:31:41]** And similarly, if we, for example,

**[1:31:43]** have a too high of a gain, so like three,

**[1:31:46]** then we see that also the gradients have,

**[1:31:48]** there's some asymmetry going on

**[1:31:49]** where as you go into deeper and deeper layers,

**[1:31:52]** the activations are also changing.

**[1:31:54]** And so that's not what we want.

**[1:31:55]** And in this case, we saw that

**[1:31:57]** without the use of BashDrum,

**[1:31:58]** as we are going through right now,

**[1:32:00]** we have to very carefully set those gains

**[1:32:03]** to get nice activations in both the forward pass

**[1:32:06]** and the backward pass.

**[1:32:07]** Now, before we move on to BashDrum realization,

**[1:32:10]** I would also like to take a look at what happens

**[1:32:12]** when we have no 10-H units here.

**[1:32:13]** So erasing all the 10-H nonlinearities,

**[1:32:16]** but keeping the gain at five over three,

**[1:32:19]** we now have just a giant linear sandwich.

**[1:32:22]** So let's see what happens to the activations.

**[1:32:24]** As we saw before, the correct gain here is one.

**[1:32:27]** That is the standard deviation preserving gain.

**[1:32:29]** So 1.667 is too high.

**[1:32:33]** And so what's gonna happen now is the following.

**[1:32:37]** I have to change this to be linear.

**[1:32:39]** So we are, because there's no more 10-H layers.

**[1:32:43]** And let me change this to linear as well.

**[1:32:46]** So what we're seeing is the activations

**[1:32:49]** started out on the blue and have by layer four

**[1:32:53]** become very diffuse.

**[1:32:55]** So what's happening to the activations is this.

**[1:32:57]** And with the gradients on the top layer,

**[1:33:00]** the activation, the gradient statistics are the purple

**[1:33:04]** and then they diminish as you go down deeper in the layers.

**[1:33:07]** And so basically you have an asymmetry,

**[1:33:09]** like in the neural net.

**[1:33:10]** And you might imagine that

**[1:33:11]** if you have very deep neural networks,

**[1:33:13]** say like 50 layers or something like that,

**[1:33:15]** this just, this is not a good place to be.

**[1:33:18]** So that's why before BashDrum realization,

**[1:33:21]** this was incredibly tricky to set.

**[1:33:24]** In particular, if this is too large of a gain,

**[1:33:26]** this happens, and if it's too little of a gain,

**[1:33:29]** then this happens.

**[1:33:31]** So the opposite of that basically happens.

**[1:33:33]** Here we have a shrinking and a diffusion,

**[1:33:39]** depending on which direction you look at it from.

**[1:33:42]** And so certainly this is not what you want.

**[1:33:44]** And in this case, the correct setting of the gain

**[1:33:46]** is exactly one, just like we're doing at initialization.

**[1:33:50]** And then we see that the statistics for the forward

**[1:33:54]** and the backward paths are well-behaved.

**[1:33:56]** And so the reason I want to show you this is

**[1:34:00]** that basically like getting neural nets to train

**[1:34:02]** before these normalization layers

**[1:34:04]** and before the use of advanced optimizers like Adam,

**[1:34:07]** which we still have to cover

**[1:34:08]** and residual connections and so on,

**[1:34:11]** training neural nets basically look like this.

**[1:34:13]** It's like a total balancing act.

**[1:34:15]** You have to make sure

**[1:34:15]** that everything is precisely orchestrated

**[1:34:18]** and you have to care about the activations

**[1:34:19]** and the gradients and their statistics.

**[1:34:21]** And then maybe you can train something,

**[1:34:23]** but it was basically impossible

**[1:34:24]** to train very deep networks.

**[1:34:25]** And this is fundamentally the reason for that.

**[1:34:28]** You'd have to be very, very careful

**[1:34:29]** with your initialization.

**[1:34:32]** The other point here is,

**[1:34:34]** you might be asking yourself,

**[1:34:35]** by the way, I'm not sure if I covered this.

**[1:34:37]** Why do we need these 10-H layers at all?

**[1:34:40]** Why do we include them

**[1:34:41]** and then have to worry about the gain?

**[1:34:43]** And the reason for that, of course,

**[1:34:45]** is that if you just have a stack of linear layers,

**[1:34:47]** then certainly we're getting very easily nice activations

**[1:34:51]** and so on, but this is just a massive linear sandwich

**[1:34:54]** and it turns out that it collapses to a single linear layer

**[1:34:57]** in terms of its representation power.

**[1:34:59]** So if you were to plot the output

**[1:35:01]** as a function of the input,

**[1:35:02]** you're just getting a linear function.

**[1:35:04]** No matter how many linear layers you stack up,

**[1:35:06]** you still just end up with a linear transformation.

**[1:35:09]** All the WX plus Bs just collapse into a large WX plus B

**[1:35:13]** with slightly different Ws and slightly different B.

**[1:35:17]** But interestingly, even though the forward pass collapses

**[1:35:19]** to just a linear layer,

**[1:35:20]** because of back propagation and the dynamics of the backward pass,

**[1:35:25]** the optimization actually is not identical.

**[1:35:28]** You actually end up with all kinds of interesting dynamics

**[1:35:32]** in the backward pass

**[1:35:34]** because of the way the chain rule is calculating it.

**[1:35:37]** And so optimizing a linear layer by itself

**[1:35:40]** and optimizing a sandwich of 10 linear layers,

**[1:35:43]** in both cases, those are just a linear transformation

**[1:35:45]** in the forward pass,

**[1:35:46]** but the training dynamics will be different.

**[1:35:48]** And there's entire papers that analyze, in fact,

**[1:35:51]** like infinitely layered linear layers and so on.

**[1:35:54]** And so there's a lot of things too

**[1:35:56]** that you can play with there.

**[1:35:58]** But basically the tenational linearities

**[1:36:00]** allow us to turn this sandwich

**[1:36:05]** from just a linear function

**[1:36:09]** into a neural network

**[1:36:11]** that can in principle approximate any arbitrary function.

**[1:36:15]** Okay, so now I've reset the code

**[1:36:16]** to use the linear 10-H sandwich like before.

**[1:36:20]** And I've reset everything, so the gain is five over three.

**[1:36:23]** Now we can run a single step of optimization

**[1:36:26]** and we can look at the activation statistics

**[1:36:28]** of the forward pass and the backward pass.

**[1:36:30]** But I've added one more plot here

**[1:36:31]** that I think is really important to look at

**[1:36:33]** when you're training your neural nets and to consider.

**[1:36:36]** And ultimately what we're doing is

**[1:36:37]** we're updating the parameters of the neural net.

**[1:36:40]** So we care about the parameters

**[1:36:41]** and their values and their gradients.

**[1:36:44]** So here what I'm doing is I'm actually iterating

**[1:36:46]** over all the parameters available

**[1:36:48]** and then I'm only restricting it

**[1:36:50]** to the two-dimensional parameters,

**[1:36:52]** which are basically the weights of these linear layers.

**[1:36:54]** And I'm skipping the biases

**[1:36:56]** and I'm skipping the gammas and the betas

**[1:36:59]** in the bachelor just for simplicity.

**[1:37:02]** But you can also take a look at those as well.

**[1:37:04]** But what's happening with the weights

**[1:37:05]** is instructive by itself.

**[1:37:08]** So here we have all the different weights, their shapes.

**[1:37:12]** So this is the embedding layer, the first linear layer,

**[1:37:15]** all the way to the very last linear layer.

**[1:37:17]** And then we have the mean, the standard deviation

**[1:37:19]** of all these parameters, the histogram.

**[1:37:22]** And you can see that it actually doesn't look that amazing.

**[1:37:24]** So there's some trouble in paradise.

**[1:37:26]** Even though these gradients looked okay,

**[1:37:28]** there's something weird going on here.

**[1:37:30]** I'll get to that in a second.

**[1:37:32]** And the last thing here is the gradient to data ratio.

**[1:37:35]** So sometimes I like to visualize this as well

**[1:37:37]** because what this gives you a sense of is

**[1:37:40]** what is the scale of the gradient

**[1:37:42]** compared to the scale of the actual values.

**[1:37:45]** And this is important because we're going to end up

**[1:37:47]** taking a step update that is the learning rate

**[1:37:51]** times the gradient onto the data.

**[1:37:54]** And so if the gradient has too large of magnitude,

**[1:37:56]** if the numbers in there are too large

**[1:37:58]** compared to the numbers in data,

**[1:38:00]** then you'd be in trouble.

**[1:38:01]** But in this case, the gradient to data

**[1:38:03]** is our low numbers.

**[1:38:05]** So the values inside grad are 1000 times smaller

**[1:38:09]** than the values inside data in these weights, most of them.

**[1:38:13]** Now, notably that is not true about the last layer.

**[1:38:17]** And so the last layer actually here, the output layer

**[1:38:19]** is a bit of a troublemaker

**[1:38:20]** in the way that this is currently arranged

**[1:38:22]** because you can see that the last layer here in pink

**[1:38:28]** takes on values that are much larger

**[1:38:30]** than some of the values inside the neural net.

**[1:38:35]** So the standard deviations are roughly

**[1:38:37]** one in negative three throughout,

**[1:38:39]** except for the last layer,

**[1:38:41]** which actually has roughly one in negative two

**[1:38:44]** standard deviation on gradients.

**[1:38:45]** And so the gradients on the last layer are currently

**[1:38:48]** about 100 times greater, sorry, 10 times greater

**[1:38:52]** than all the other weights inside the neural net.

**[1:38:55]** And so that's problematic because

**[1:38:57]** in the simple stochastic gradient in the send setup,

**[1:39:00]** you would be training this last layer

**[1:39:02]** about 10 times faster

**[1:39:03]** than you would be training the other layers

**[1:39:05]** at initialization.

**[1:39:07]** Now, this actually like kind of fixes itself a little bit

**[1:39:10]** if you train for a bit longer.

**[1:39:11]** So for example, if I greater than 1000,

**[1:39:14]** only then do a break, let me re-initialize.

**[1:39:17]** And then let me do it 1000 steps.

**[1:39:20]** And after 1000 steps, we can look at the forward pass.

**[1:39:24]** Okay, so you see how the neurons are a bit

**[1:39:26]** are saturating a bit.

**[1:39:27]** And we can also look at the backward pass,

**[1:39:30]** but otherwise they look good.

**[1:39:31]** They're about equal and there's no shrinking to zero

**[1:39:34]** or exploding to infinities.

**[1:39:36]** And you can see that here in the weights,

**[1:39:38]** things are also stabilizing a little bit.

**[1:39:40]** So the tails of the last pink layer

**[1:39:42]** are actually coming in during the optimization.

**[1:39:46]** But certainly this is like a little bit of troubling,

**[1:39:48]** especially if you are using a very simple update rule,

**[1:39:51]** like stochastic gradient descent

**[1:39:52]** instead of a modern optimizer like Adam.

**[1:39:55]** Now I'd like to show you one more plot

**[1:39:56]** that I usually look at when I train neural networks.

**[1:39:59]** And basically the gradient to data ratio

**[1:40:01]** is not actually that informative

**[1:40:03]** because what matters at the end

**[1:40:04]** is not the gradient to data ratio,

**[1:40:06]** but the update to the data ratio

**[1:40:08]** because that is the amount by which we will actually change

**[1:40:10]** the data in these tensors.

**[1:40:13]** So coming up here, what I'd like to do

**[1:40:15]** is I'd like to introduce a new update to data ratio.

**[1:40:19]** It's going to be less than we're going to build it out

**[1:40:21]** every single iteration.

**[1:40:23]** And here I'd like to keep track of basically

**[1:40:25]** the ratio every single iteration.

**[1:40:30]** So without any gradients,

**[1:40:33]** I'm comparing the update,

**[1:40:35]** which is learning rate times the gradient.

**[1:40:39]** That is the update that we're going to apply

**[1:40:40]** to every parameter.

**[1:40:42]** So see, I'm iterating over all the parameters.

**[1:40:44]** And then I'm taking the basically standard deviation

**[1:40:46]** of the update we're going to apply

**[1:40:48]** and divided by the actual content,

**[1:40:52]** the data of that parameter and its standard deviation.

**[1:40:56]** So this is the ratio of basically

**[1:40:58]** how great are the updates to the values

**[1:41:00]** in these tensors.

**[1:41:02]** Then we're going to take a log of it

**[1:41:03]** and actually I'd like to take a log 10

**[1:41:07]** just so it's a nicer visualization.

**[1:41:10]** So we're going to be basically looking

**[1:41:11]** at the exponents of this division here.

**[1:41:16]** And then that item to pop out the float.

**[1:41:19]** And we're going to be keeping track of this

**[1:41:20]** for all the parameters and adding it to this UD tensor.

**[1:41:24]** So now let me re-initialize and run 1000 iterations.

**[1:41:27]** We can look at the activations,

**[1:41:30]** the gradients and the parameter gradients

**[1:41:32]** as we did before.

**[1:41:34]** But now I have one more plot here to introduce.

**[1:41:37]** And what's happening here is we're iterating

**[1:41:39]** over all the parameters and I'm constraining it again

**[1:41:41]** like I did here to just the weights.

**[1:41:44]** So the number of dimensions in these sensors is two.

**[1:41:47]** And then I'm basically plotting

**[1:41:49]** all of these update ratios over time.

**[1:41:54]** So when I plot this, I plot those ratios

**[1:41:57]** and you can see that they evolve over time

**[1:41:59]** during initialization to take on certain values.

**[1:42:02]** And then these updates sort of like start stabilizing

**[1:42:04]** usually during training.

**[1:42:05]** Then the other thing that I'm plotting here

**[1:42:07]** is I'm plotting here like an approximate value

**[1:42:09]** that is a rough guide for what it roughly should be.

**[1:42:12]** And it should be like roughly one in negative three.

**[1:42:15]** And so that means that basically

**[1:42:17]** there's some values in this tensor

**[1:42:19]** and they take on certain values

**[1:42:21]** and the updates to them at every single iteration

**[1:42:24]** are no more than roughly 1000th

**[1:42:27]** of the actual like magnitude in those tensors.

**[1:42:30]** If this was much larger, like for example,

**[1:42:33]** if this was, if the log of this was like saying negative one,

**[1:42:37]** this is actually updating those values quite a lot.

**[1:42:40]** They're undergoing a lot of change.

**[1:42:42]** But the reason that the final rate,

**[1:42:43]** the final layer here is an outlier

**[1:42:46]** is because this layer was artificially shrunk down

**[1:42:50]** to keep the softmax incompetent.

**[1:42:54]** So here you see how we multiply the weight by 0.1

**[1:42:59]** in the initialization to make the last layer

**[1:43:02]** prediction less confident.

**[1:43:04]** That made, that artificially made the values

**[1:43:07]** inside that tensor way too low.

**[1:43:09]** And that's why we're getting temporarily a very high ratio.

**[1:43:12]** But you see that that stabilizes over time

**[1:43:14]** once that weight starts to learn.

**[1:43:18]** But basically I like to look at the evolution

**[1:43:19]** of this update ratio for all my parameters usually.

**[1:43:23]** And I like to make sure that it's not too much

**[1:43:26]** above one negative three roughly.

**[1:43:29]** So around negative three on this log plot.

**[1:43:33]** If it's below negative three, usually that means

**[1:43:34]** that the parameters are not trained fast enough.

**[1:43:37]** So if our learning rate was very low,

**[1:43:39]** let's do that experiment.

**[1:43:41]** Let's initialize.

**[1:43:43]** And then let's actually do a learning rate

**[1:43:44]** of say one negative three here.

**[1:43:47]** So 0.001.

**[1:43:49]** If your learning rate is way too low,

**[1:43:53]** this plot will typically reveal it.

**[1:43:56]** So you see how all of these updates are way too small.

**[1:44:00]** So the size of the update is basically 10,000 times

**[1:44:06]** in magnitude to the size of the numbers

**[1:44:09]** in that tensor in the first place.

**[1:44:10]** So this is a symptom of training way too slow.

**[1:44:14]** So this is another way to sometimes set the learning rate

**[1:44:16]** and to get a sense of what that learning rate should be.

**[1:44:19]** And ultimately this is something

**[1:44:20]** that you would keep track of.

**[1:44:25]** If anything, the learning rate here

**[1:44:27]** is a little bit on the higher side

**[1:44:29]** because you see that we're above the black line

**[1:44:33]** of negative three, we're somewhere around negative 2.5.

**[1:44:36]** It's like, okay, but everything is like somewhat stabilizing.

**[1:44:39]** And so this looks like a pretty decent setting

**[1:44:41]** of learning rates and so on.

**[1:44:44]** But this is something to look at.

**[1:44:45]** And when things are miscalibrated,

**[1:44:46]** you will see very quickly.

**[1:44:48]** So for example, everything looks pretty well behaved, right?

**[1:44:52]** But just as a comparison,

**[1:44:53]** when things are not properly calibrated,

**[1:44:55]** what does that look like?

**[1:44:56]** Let me come up here and let's say

**[1:44:58]** that for example, what do we do?

**[1:45:01]** Let's say that we forgot to apply this fan in normalization.

**[1:45:05]** So the weights inside the linear layers

**[1:45:07]** are just a sample from a Gaussian in all the stages.

**[1:45:10]** What happens to our,

**[1:45:12]** how do we notice that something's off?

**[1:45:14]** Well, the activation plot will tell you,

**[1:45:16]** whoa, your neurons are way too saturated.

**[1:45:18]** The gradients are gonna be all messed up.

**[1:45:21]** The histogram for these weights

**[1:45:22]** are gonna be all messed up as well.

**[1:45:25]** And there's a lot of asymmetry.

**[1:45:27]** And then if we look here,

**[1:45:28]** I suspect it's all gonna be also pretty messed up.

**[1:45:30]** So you see, there's a lot of discrepancy

**[1:45:34]** in how fast these layers are learning.

**[1:45:36]** And some of them are learning way too fast.

**[1:45:38]** So negative one, negative 1.5,

**[1:45:41]** those are very large numbers in terms of this ratio.

**[1:45:44]** Again, you should be somewhere around negative three

**[1:45:45]** and not much more about that.

**[1:45:48]** So this is how miscalibration,

**[1:45:50]** so if your neurons are going to manifest.

**[1:45:52]** And these kinds of plots here

**[1:45:54]** are a good way of sort of bringing those miscalibrations

**[1:45:59]** sort of to your attention.

**[1:46:02]** And so you can address them.

**[1:46:04]** Okay, so so far we've seen that

**[1:46:05]** when we have this linear 10-H sandwich,

**[1:46:08]** we can actually precisely calibrate the gains

**[1:46:10]** and make the activations, the gradients

**[1:46:12]** and the parameters and the updates

**[1:46:14]** all look pretty decent.

**[1:46:15]** But it definitely feels a little bit like balancing

**[1:46:19]** of a pencil on your finger.

**[1:46:21]** And that's because this gain

**[1:46:22]** has to be very precisely calibrated.

**[1:46:25]** So now let's introduce batch normalization layers

**[1:46:27]** into the mix and let's see how that helps fix the problem.

**[1:46:33]** So here I'm going to take the batch from 1D class

**[1:46:38]** and I'm going to start placing it inside.

**[1:46:41]** And as I mentioned before,

**[1:46:42]** the standard typical place you would place it

**[1:46:45]** is between the linear layer,

**[1:46:47]** so right after it, but before the nonlinearity.

**[1:46:49]** But people have definitely played with that.

**[1:46:51]** And in fact, you can get very similar results

**[1:46:54]** even if you place it after the nonlinearity.

**[1:46:57]** And the other thing that I wanted to mention

**[1:46:59]** is it's totally fine to also place it at the end

**[1:47:01]** after the last linear layer and before the loss function.

**[1:47:04]** So this is potentially fine as well.

**[1:47:08]** And in this case, this would be output,

**[1:47:11]** would be vocab size.

**[1:47:14]** Now, because the last layer is batch norm,

**[1:47:17]** we would not be changing the weight

**[1:47:18]** to make the softmax less confident.

**[1:47:20]** We'd be changing the gamma.

**[1:47:23]** Because gamma, remember in the batch norm,

**[1:47:25]** is the variable that multiplicatively interacts

**[1:47:28]** with the output of that normalization.

**[1:47:32]** So we can initialize this sandwich now.

**[1:47:35]** We can train and we can see that the activations

**[1:47:39]** are going to of course look very good

**[1:47:41]** and they are going to necessarily look good

**[1:47:44]** because now before every single 10H layer,

**[1:47:46]** there is a normalization in the batch norm.

**[1:47:49]** So this is unsurprisingly, all looks pretty good.

**[1:47:53]** It's going to be standard deviation of roughly 0.65, 2%

**[1:47:56]** and roughly equals standard deviation

**[1:47:58]** throughout the entire layers.

**[1:47:59]** So everything looks very homogeneous.

**[1:48:02]** The gradients look good, the weights look good

**[1:48:06]** and their distributions.

**[1:48:09]** And then the updates also look pretty reasonable.

**[1:48:14]** We're going above negative three a little bit

**[1:48:16]** but not by too much.

**[1:48:17]** So all the parameters are training

**[1:48:19]** at roughly the same rate here.

**[1:48:24]** But now what we've gained is we are going to be

**[1:48:27]** slightly less brittle with respect to the gain of these.

**[1:48:34]** So for example, I can make the gain be say 0.2 here,

**[1:48:39]** which was much much slower than what we had with the 10H.

**[1:48:42]** But as we'll see the activations

**[1:48:44]** will actually be exactly unaffected.

**[1:48:46]** And that's because of again this explicit normalization.

**[1:48:49]** The gradients are going to look okay.

**[1:48:51]** The weight gradients are going to look okay.

**[1:48:53]** But actually the updates will change.

**[1:48:56]** And so even though the forward and backward pass

**[1:48:59]** to a very large extent look okay

**[1:49:01]** because of the backward pass of the batch norm

**[1:49:03]** and how the scale of the incoming activations

**[1:49:06]** interacts in the batch norm and its backward pass,

**[1:49:10]** this is actually changing the scale

**[1:49:14]** of the updates on these parameters.

**[1:49:16]** So the gradients of these weights are affected.

**[1:49:19]** So we still don't get a completely free pass

**[1:49:21]** to pass an arbitrary weights here,

**[1:49:25]** but everything else is significantly more robust

**[1:49:28]** in terms of the forward, backward, and the weight gradients.

**[1:49:33]** It's just that you may have to retune your learning rate

**[1:49:35]** if you are changing sufficiently the scale

**[1:49:38]** of the activations that are coming into the batch norms.

**[1:49:41]** So here for example, we changed the gains

**[1:49:45]** of these linear layers to be greater.

**[1:49:47]** And we're seeing that the updates are coming out

**[1:49:48]** lower as a result.

**[1:49:51]** And then finally we can also, if we are using batch norms,

**[1:49:54]** we don't actually need to necessarily,

**[1:49:56]** let me reset this to one so there's no gain.

**[1:49:59]** We don't necessarily even have to

**[1:50:01]** normalize by fan-in sometimes.

**[1:50:03]** So if I take out the fan-in,

**[1:50:04]** so these are just now random Gaussian,

**[1:50:08]** we'll see that because of batch norm

**[1:50:09]** this will actually be relatively well behaved.

**[1:50:11]** So this is of course in the forward pass look good.

**[1:50:17]** The gradients look good.

**[1:50:19]** The weight updates look okay.

**[1:50:23]** A little bit of fat tails on some of the layers.

**[1:50:26]** And this looks okay as well.

**[1:50:29]** But as you can see, we're significantly below negative three

**[1:50:33]** so we'd have to bump up the learning rate of this batch norm

**[1:50:36]** so that we are training more properly.

**[1:50:39]** And in particular looking at this roughly looks like

**[1:50:41]** we have to 10x the learning rate

**[1:50:43]** to get to about 1e negative three.

**[1:50:46]** So we've come here and we would change this

**[1:50:48]** to be update of 1.0.

**[1:50:51]** And if we now re-initialize,

**[1:50:59]** then we'll see that everything still of course looks good.

**[1:51:02]** And now we are roughly here

**[1:51:04]** and we expect this to be an okay training run.

**[1:51:07]** So long story short,

**[1:51:08]** we are significantly more robust

**[1:51:09]** to the gain of these linear layers,

**[1:51:11]** whether or not we have to apply the fan-in

**[1:51:14]** and then we can change the gain

**[1:51:16]** but we actually do have to worry a little bit

**[1:51:18]** about the update scales

**[1:51:20]** and making sure that the learning rate

**[1:51:22]** is properly calibrated here.

**[1:51:24]** But the activations of the forward, backward pass

**[1:51:26]** and the updates are looking significantly more well-behaved

**[1:51:30]** except for the global scale

**[1:51:31]** that is potentially being adjusted here.

**[1:51:34]** Okay, so now let me summarize.

**[1:51:36]** There are three things I was hoping to achieve

**[1:51:38]** with this section.

**[1:51:39]** Number one, I wanted to introduce you

**[1:51:41]** to batch normalization,

**[1:51:42]** which is one of the first modern innovations

**[1:51:44]** that we're looking into

**[1:51:45]** that helped stabilize very deep neural networks

**[1:51:48]** and their training.

**[1:51:49]** And I hope you understand how the batch normalization works

**[1:51:52]** and how it would be used in a neural network.

**[1:51:56]** Number two, I was hoping to pytorchify some of our code

**[1:51:59]** and wrap it up into these modules.

**[1:52:01]** So like linear, batch normality, 10-H, et cetera.

**[1:52:04]** These are layers or modules

**[1:52:06]** and they can be stacked up into neural nets

**[1:52:09]** like Lego building blocks.

**[1:52:11]** And these layers actually exist in pytorch.

**[1:52:15]** And if you import torch and then

**[1:52:16]** then you can actually, the way I've constructed it,

**[1:52:19]** you can simply just use pytorch

**[1:52:21]** by prepending an end dot to all these different layers.

**[1:52:25]** And actually everything will just work

**[1:52:27]** because the API that I've developed here

**[1:52:29]** is identical to the API that pytorch uses.

**[1:52:32]** And the implementation also is basically,

**[1:52:35]** as far as I'm aware, identical to the one in pytorch.

**[1:52:38]** And number three, I tried to introduce you

**[1:52:40]** to the diagnostic tools that you would use

**[1:52:42]** to understand whether your neural network

**[1:52:44]** is in a good state dynamically.

**[1:52:46]** So we are looking at the statistics

**[1:52:48]** and histograms and activation

**[1:52:49]** of the forward pass activations,

**[1:52:52]** the backward pass gradients.

**[1:52:54]** And then also we're looking at the weights

**[1:52:55]** that are going to be updated

**[1:52:57]** as part of stochastic gradient descent.

**[1:52:59]** And we're looking at their means, standard deviations

**[1:53:01]** and also the ratio of gradients to data

**[1:53:04]** or even better, the updates to data.

**[1:53:07]** And we saw that typically we don't actually look at it

**[1:53:10]** as a single snapshot frozen in time

**[1:53:12]** at some particular iteration.

**[1:53:13]** Typically people look at this as over time

**[1:53:16]** just like I've done here.

**[1:53:17]** And they look at these update to data ratios

**[1:53:19]** and they make sure everything looks okay.

**[1:53:21]** And in particular, I said that one negative three

**[1:53:25]** or basically negative three on the log scale

**[1:53:27]** is a good rough heuristic

**[1:53:29]** for what you want this ratio to be.

**[1:53:31]** And if it's way too high,

**[1:53:32]** then probably the learning rate

**[1:53:34]** or the updates are a little too big.

**[1:53:36]** And if it's way too small

**[1:53:37]** that the learning rate is probably too small.

**[1:53:39]** So that's just some of the things

**[1:53:40]** that you may wanna play with

**[1:53:42]** when you try to get your neural network

**[1:53:43]** to work with very well.

**[1:53:46]** Now there's a number of things I did not try to achieve.

**[1:53:49]** I did not try to beat our previous performance

**[1:53:51]** as an example by introducing the bachelor layer.

**[1:53:53]** Actually I did try

**[1:53:55]** and I found that I used the learning rate

**[1:53:57]** finding mechanism that I've described before.

**[1:53:59]** I tried to train a bachelor layer, a bachelor neural net

**[1:54:03]** and I actually ended up with results

**[1:54:05]** that are very, very similar to what we've obtained before.

**[1:54:08]** And that's because our performance now

**[1:54:10]** is not bottlenecked by the optimization

**[1:54:13]** which is what bachelor is helping with.

**[1:54:15]** The performance at the stage is bottlenecked by

**[1:54:17]** what I suspect is the context length of our context.

**[1:54:22]** So currently we are taking three characters

**[1:54:23]** to predict the fourth one

**[1:54:24]** and I think we need to go beyond that

**[1:54:26]** and we need to look at more powerful architectures

**[1:54:28]** for our like recurrent neural networks

**[1:54:30]** and transformers in order to further push

**[1:54:33]** the lack probabilities that we're achieving on this data set.

**[1:54:36]** And I also did not try to have a full explanation

**[1:54:40]** of all of these activations, the gradients

**[1:54:42]** and the backward pass and the statistics

**[1:54:44]** of all these gradients.

**[1:54:45]** And so you may have found some of the parts here

**[1:54:47]** unintuitive and maybe you're slightly confused about,

**[1:54:49]** okay, if I change the gain here,

**[1:54:52]** how come that we need a different learning rate?

**[1:54:54]** And I didn't go into the full detail

**[1:54:55]** because you'd have to actually look at the backward pass

**[1:54:57]** of all these different layers

**[1:54:58]** and get an intuitive understanding of how that works.

**[1:55:01]** And I did not go into that in this lecture.

**[1:55:04]** The purpose really was just to introduce you

**[1:55:05]** to the diagnostic tools and what they look like

**[1:55:08]** but there's still a lot of work remaining

**[1:55:09]** on the intuitive level to understand the initialization,

**[1:55:12]** the backward pass and how all of that interacts.

**[1:55:15]** But you shouldn't feel too bad

**[1:55:16]** because honestly we are getting to the cutting edge

**[1:55:21]** of where the field is.

**[1:55:22]** We certainly haven't, I would say, solved initialization

**[1:55:25]** and we haven't solved back propagation

**[1:55:28]** and these are still very much an active area of research.

**[1:55:30]** People are still trying to figure out

**[1:55:32]** what is the best way to initialize these networks,

**[1:55:33]** what is the best update rule to use and so on.

**[1:55:37]** So none of this is really solved

**[1:55:38]** and we don't really have all the answers to all these cases.

**[1:55:44]** But at least we're making progress

**[1:55:46]** and at least we have some tools to tell us

**[1:55:48]** whether or not things are on the right track for now.

**[1:55:51]** So I think we've made positive progress in this lecture

**[1:55:55]** and I hope you enjoyed that

**[1:55:56]** and I will see you next time.

