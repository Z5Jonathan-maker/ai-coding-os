---
source: "https://www.youtube.com/watch?v=q8SA3rM6ckI"
kind: video
title: "Building makemore Part 4: Becoming a Backprop Ninja"
retrieved: "2026-05-04T07:00:43+00:00"
word_count: 22679
char_count: 133735
source_url: "https://www.youtube.com/watch?v=q8SA3rM6ckI"
---

# Building makemore Part 4: Becoming a Backprop Ninja

# Building makemore Part 4: Becoming a Backprop Ninja

- **Source:** https://www.youtube.com/watch?v=q8SA3rM6ckI
- **Uploader:** Andrej Karpathy
- **Duration:** 1:55:24

## Description

We take the 2-layer MLP (with BatchNorm) from the previous video and backpropagate through it manually without using PyTorch autograd's loss.backward(): through the cross entropy loss, 2nd linear layer, tanh, batchnorm, 1st linear layer, and the embedding table. Along the way, we get a strong intuitive understanding about how gradients flow backwards through the compute graph and on the level of efficient Tensors, not just individual scalars like in micrograd. This helps build competence and intuition around how neural nets are optimized and sets you up to more confidently innovate on and debug modern neural networks.

!!!!!!!!!!!!
I recommend you work through the exercise yourself but work with it in tandem and whenever you are stuck unpause the video and see me give away the answer. This video is not super intended to be simply watched. The exercise is here:
https://colab.research.google.com/drive/1WV2oi2fh9XXyldh02wupFQX0wh5ZC-z-?usp=sharing
!!!!!!!!!!!!

Links:
- makemore on github: https://github.com/karpathy/makemore
- jupyter notebook I built in this video: https://github.com/karpathy/nn-zero-to-hero/blob/master/lectures/makemore/makemore_part4_backprop.ipynb
- collab notebook: https://colab.research.google.com/drive/1WV2oi2fh9XXyldh02wupFQX0wh5ZC-z-?usp=sharing
- my website: https://karpathy.ai
- my twitter: https://twitter.com/karpathy
- our Discord channel: https://discord.gg/3zy8kqD9Cp

Supplementary links:
- Yes you should understand backprop: https://karpathy.medium.com/yes-you-should-understand-backprop-e2f06eab496b
- BatchNorm paper: https://arxiv.org/abs/1502.03167
- Bessel’s Correction: http://math.oxford.emory.edu/site/math117/besselCorrection/
- Bengio et al. 2003 MLP LM https://www.jmlr.org/papers/volume3/bengio03a/bengio03a.pdf 

Chapters:
00:00:00 intro: why you should care & fun history
00:07:26 starter code
00:13:01 exercise 1: backproping the atomic compute graph
01:05:17 brief digression: bessel’s correction in batchnorm
01:26:31 exercise 2: cross entropy loss backward pass
01:36:37 exercise 3: batch norm layer backward pass
01:50:02 exercise 4: putting it all together
01:54:24 outro

## Transcript

**[0:00:00]** Hi, everyone. So today we are once again continuing our implementation of Make More.

**[0:00:04]** Now, so far we've come up to here multi-lieopereceptrons, and our neural net looked like this, and

**[0:00:11]** we were implementing this over the last few lectures. Now, I'm sure everyone is very

**[0:00:14]** excited to go into recurring neural networks and all of their variants and how they work,

**[0:00:18]** and the diagrams look cool, and it's very exciting and interesting, and we're

**[0:00:21]** going to get a better result. But unfortunately, I think we have to remain here for one

**[0:00:24]** more lecture, and the reason for that is we've already trained this multi-lieopereceptron,

**[0:00:30]** right, and we are getting pretty good loss, and I think we have a pretty decent

**[0:00:33]** understanding of the architecture and how it works. But the line of code here that I

**[0:00:38]** take an issue with is here, lost at backward. That is, we are taking PyTorch

**[0:00:43]** autograd and using it to calculate all of our gradients along the way, and I

**[0:00:47]** would like to remove the use of lost at backward, and I would like us to

**[0:00:51]** write our backward pass manually on the level of tensors, and I think that this is

**[0:00:55]** a very useful exercise for the following reasons. I actually have an entire block

**[0:00:59]** post on this topic, but I like to call back propagation a leaky abstraction,

**[0:01:04]** and what I mean by that is back propagation doesn't just make your

**[0:01:09]** neural networks just work magically. It's not the case that you can just

**[0:01:12]** stack up arbitrary Lego blocks of differentiable functions and just

**[0:01:14]** cross your fingers and back propagate and everything is great. Things don't just

**[0:01:19]** work automatically. It is a leaky abstraction in the sense that you can

**[0:01:23]** shoot yourself in the foot if you do not understand its internals. It will

**[0:01:27]** magically not work or not work optimally, and you will need to understand how it

**[0:01:32]** works under the hood if you're hoping to debug it and if you are hoping to

**[0:01:35]** address it in your neural nut. So this block post here from a while ago goes

**[0:01:40]** into some of those examples. So for example, we've already covered them,

**[0:01:43]** some of them already. For example, the flat tails of these functions and

**[0:01:48]** how you do not want to saturate them too much because your gradients will die.

**[0:01:52]** The case of dead neurons, which I've already covered as well. The case of

**[0:01:57]** exploding or vanishing gradients in the case of recurrent neural networks,

**[0:02:00]** which we are about to cover. And then also you will often come across

**[0:02:05]** some examples in the wild. This is a snippet that I found in a random code

**[0:02:10]** based on the internet where they actually have like a very subtle but

**[0:02:13]** pretty major bug in their implementation. And the bug points at the fact that the

**[0:02:19]** author of this code does not actually understand back propagation. So what

**[0:02:22]** they're trying to do here is they're trying to clip the loss at a certain

**[0:02:25]** maximum value. But actually what they're trying to do is they're trying to

**[0:02:28]** clip the gradients to have a maximum value instead of trying to clip the

**[0:02:31]** loss at a maximum value. And indirectly they're basically causing some of

**[0:02:36]** the outliers to be actually ignored because when you clip a loss of an

**[0:02:41]** outlier you are setting its gradient to zero. And so have a look through this

**[0:02:46]** and read through it. But there's basically a bunch of subtle issues that

**[0:02:50]** you're going to avoid if you actually know what you're doing. And that's why

**[0:02:52]** I don't think it's the case that because PyTorch or other frameworks offer

**[0:02:56]** autograd it is okay for us to ignore how it works. Now we've actually

**[0:03:01]** already covered autograd and we wrote micrograd. But micrograd was an

**[0:03:06]** autograd engine only on the level of individual scalars. So the atoms

**[0:03:10]** single individual numbers. And you know I don't think it's enough and I'd

**[0:03:14]** like us to basically think about back propagation on level of tensors as well.

**[0:03:17]** And so in a summary I think it's a good exercise. I think it is very very

**[0:03:21]** valuable. You're going to become better at debugging your own networks and

**[0:03:25]** making sure that you understand what you're doing. It is going to make

**[0:03:28]** everything fully explicit so you're not going to be nervous about what is

**[0:03:31]** hidden away from you. And basically in general we're going to emerge

**[0:03:34]** stronger. And so let's get into it. A bit of a fun historical note here

**[0:03:39]** is that today writing your backward pass by hand and manually is not recommended

**[0:03:43]** and no one does it except for the purposes of exercise. But about 10 years

**[0:03:47]** ago in deep learning this was fairly standard and in fact pervasive.

**[0:03:51]** So at the time everyone used to write their own backward pass by hand

**[0:03:54]** manually including myself. And it's just what you would do.

**[0:03:57]** So we used to write backward pass by hand and now everyone just

**[0:04:00]** called lost that backward. We've lost something.

**[0:04:03]** I wanted to give you a few examples of this. So here's a 2006

**[0:04:08]** paper from Jeff Hinton and Ruslan Slakhtinov

**[0:04:12]** in science that was influential at the time. And this was training some

**[0:04:16]** architectures called restricted Boltzmann machines. And basically it's an

**[0:04:20]** autoencoder trained here. And this is from roughly 2010.

**[0:04:25]** I had a library for training restricted Boltzmann machines.

**[0:04:28]** And this was at the time written in MATLAB. So Python was not used for

**[0:04:32]** deep learning pervasively. It was all MATLAB. And MATLAB was this

**[0:04:36]** scientific computing package that everyone would use.

**[0:04:39]** So we would write MATLAB which is barely a programming language

**[0:04:43]** in a big as well. But it had a very convenient tensor class.

**[0:04:46]** And it was this computing environment and you would run here. It would all run

**[0:04:49]** on the CPU of course. But you would have very nice plots to go

**[0:04:52]** with it and a built-in debugger and it was pretty nice.

**[0:04:55]** Now the code in this package in 2010 that I wrote

**[0:04:59]** for fitting restricted Boltzmann machines to a large extent is

**[0:05:03]** recognizable. But I wanted to show you how you would...

**[0:05:06]** Well I'm creating the data in the XY batches. I'm initializing the neural

**[0:05:10]** nut. So it's got weights and biases just

**[0:05:12]** like we're used to. And then this is the training loop

**[0:05:15]** where we actually do the forward pass. And then here at this time didn't even

**[0:05:19]** necessarily use back propagation to train neural networks.

**[0:05:22]** So this in particular implements contrastive divergence

**[0:05:25]** which estimates a gradient. And then here we take that gradient

**[0:05:30]** and use it for a parameter update along the lines that we're used to.

**[0:05:34]** Yeah here. But you can see that basically people are meddling with these

**[0:05:38]** gradients directly and inline and themselves.

**[0:05:41]** It wasn't that common to use an autograd engine. Here's one more example

**[0:05:44]** from a paper of mine from 2014 called the fragment embeddings.

**[0:05:49]** And here what I was doing is I was aligning images and text.

**[0:05:53]** And so it's kind of like a clip if you're familiar with it. But instead

**[0:05:56]** of working on the level of entire images and entire sentences

**[0:05:59]** it was working on the level of individual objects and little pieces of

**[0:06:02]** sentences. And I was embedding them and then

**[0:06:04]** calculating a very much like a clip like loss.

**[0:06:07]** And I decked up the code from 2014 of how I implemented this.

**[0:06:10]** And it was already in NumPy and Python.

**[0:06:14]** And here I'm implementing the cost function. And it was

**[0:06:17]** standard to implement not just the cost but also the backward pass manually.

**[0:06:21]** So here I'm calculating the image embeddings, sentence embeddings,

**[0:06:25]** the loss function. I calculate this course.

**[0:06:28]** This is the loss function. And then once I have the loss function

**[0:06:32]** I do the backward pass right here. So I backward through the loss function

**[0:06:36]** and through the neural net and I append regularization.

**[0:06:39]** So everything was done by hand manually and you were just right out the

**[0:06:42]** backward pass. And then you would use a gradient

**[0:06:45]** checker to make sure that your numerical estimate of the gradient

**[0:06:47]** agrees with the one you calculated during back propagation.

**[0:06:50]** So this was very standard for a long time but today of course it is

**[0:06:53]** standard to use an autographed engine. But it was definitely useful and I

**[0:06:58]** think people sort of understood how these neural networks work on a very

**[0:07:00]** intuitive level. And so I think it's a good exercise again

**[0:07:03]** and this is where we want to be. Okay so just as a reminder from our

**[0:07:06]** previous lecture this is the Jupyter notebook that we implemented at the

**[0:07:09]** time. And we're going to keep everything the

**[0:07:12]** same. So we're still going to have a two-layer

**[0:07:14]** multilayer perceptron with a batch normalization layer.

**[0:07:17]** So the forward pass will be basically identical to this lecture

**[0:07:20]** but here we're going to get rid of loss.backward and instead we're

**[0:07:23]** going to write the backward pass manually. Now here's the starter code for this

**[0:07:27]** lecture. We are becoming a backprop ninja in this

**[0:07:30]** notebook and the first few cells here are

**[0:07:33]** identical to what we are used to. So we are doing some imports loading the

**[0:07:37]** data set and processing the data set. None of this changed.

**[0:07:41]** Now here I'm introducing a utility function that we're going to use

**[0:07:44]** later to compare the gradients. So in particular we are going to have the

**[0:07:47]** gradients that we estimate manually ourselves and we're going to have

**[0:07:50]** gradients that PyTorch calculates and we're going to be

**[0:07:53]** checking for correctness assuming of course that PyTorch is correct.

**[0:07:58]** Then here we have the initialization that we are quite used to.

**[0:08:01]** So we have our embedding table for the characters,

**[0:08:04]** the first layer, second layer and a batch normalization in between.

**[0:08:08]** And here's where we create all the parameters. Now you will note that I

**[0:08:11]** changed the initialization a little bit to be small numbers.

**[0:08:15]** So normally you would set the biases to be all zero. Here I am setting

**[0:08:18]** them to be small random numbers. And I'm doing this because

**[0:08:22]** if your variables are initialized to exactly zero sometimes what can happen

**[0:08:26]** is that can mask an incorrect implementation of a gradient.

**[0:08:30]** Because when everything is zero it sort of like simplifies and gives you

**[0:08:33]** a much simpler expression of the gradient than you would otherwise get.

**[0:08:36]** And so by making it small numbers I'm trying to unmask those potential

**[0:08:40]** errors in these calculations. You also notice that I'm using

**[0:08:45]** B1 in the first layer. I'm using a bias despite batch normalization right

**[0:08:49]** afterwards. So this would typically not be what you

**[0:08:52]** do because we talked about the fact that you don't need a bias.

**[0:08:55]** But I'm doing this here just for fun because we're going to have a gradient

**[0:08:59]** with respect to it and we can check that we are still calculating it correctly

**[0:09:02]** even though this bias is spurious. So here I'm calculating a single batch

**[0:09:07]** and then here I am doing a forward pass. Now you'll notice that the

**[0:09:11]** forward pass is significantly expanded from what we are used to.

**[0:09:14]** Here the forward pass was just here. Now the reason that the forward pass is

**[0:09:19]** longer is for two reasons. Number one here we just

**[0:09:22]** had an f.cross entropy but here I am bringing back

**[0:09:25]** a explicit implementation of the loss function. And number two

**[0:09:29]** I've broken up the implementation into manageable chunks.

**[0:09:33]** So we have a lot more intermediate tensors along the way in the forward

**[0:09:37]** pass and that's because we are about to go

**[0:09:39]** backwards and calculate the gradients in this back propagation

**[0:09:43]** from the bottom to the top. So we're going to go

**[0:09:47]** upwards and just like we have for example the log props tensor in a forward pass

**[0:09:51]** in the backward pass we're going to have a d log props which is going to store

**[0:09:54]** the derivative of the loss with respect to the log props tensor.

**[0:09:57]** And so we're going to be pre-pending d to every one of these tensors and

**[0:10:01]** calculating it along the way of this back propagation.

**[0:10:05]** So as an example we have a b and raw here we're going to be calculating a

**[0:10:08]** d, b and raw. So here I'm telling PyTorch

**[0:10:12]** that we want to retain the grad of all these intermediate values

**[0:10:16]** because here in exercise one we're going to calculate the backward pass.

**[0:10:19]** So we're going to calculate all these d variables and use the cmp function

**[0:10:24]** I've introduced above to check our correctness with respect to what PyTorch

**[0:10:27]** is telling us. This is going to be exercise one

**[0:10:31]** where we sort of back propagate through this entire graph.

**[0:10:34]** Now just to give you a very quick preview of what's going to happen in

**[0:10:37]** exercise two and below here we have fully broken up

**[0:10:41]** the loss and back propagated through it manually

**[0:10:44]** in all the little atomic pieces that make it up. But here we're going to collapse

**[0:10:48]** the loss into a single cross-entropy call and instead we're going to

**[0:10:52]** analytically derive using math and paper and pencil

**[0:10:57]** the gradient of the loss with respect to the logits

**[0:11:00]** and instead of back propagating through all of its little chunks one at a

**[0:11:03]** time we're just going to analytically derive what that gradient is

**[0:11:06]** and we're going to implement that which is much more efficient as we'll

**[0:11:09]** see in a bit. Then we're going to do the the exact

**[0:11:12]** same thing for batch normalization. So instead of breaking up batch

**[0:11:15]** normal into all the little tiny components we're going to use

**[0:11:18]** pen and paper and mathematics and calculus to derive the gradient

**[0:11:22]** through the batch normal layer. So we're going to

**[0:11:25]** calculate the backward pass through batch normal layer in a much more

**[0:11:28]** efficient expression instead of back propagating through all of its

**[0:11:31]** little pieces independently. So it's going to be

**[0:11:34]** exercise three and then in exercise four we're going to put it all

**[0:11:38]** together and this is the full code of training this

**[0:11:40]** two-layer MLP and we're going to basically insert our manual backup

**[0:11:45]** and we're going to take out lost up backward and you will basically see

**[0:11:49]** that you can get all the same results using fully your own code

**[0:11:53]** and the only thing we're using from PyTorch

**[0:11:56]** is the torch.tensor to make the calculation sufficient

**[0:12:00]** but otherwise you will understand fully what it means to forward and

**[0:12:03]** backward neural net and train it and I think that will be awesome.

**[0:12:06]** So let's get to it. Okay so I ran all the cells of this notebook

**[0:12:10]** all the way up to here and I'm going to erase this and I'm going to start

**[0:12:14]** implementing backward pass starting with delockprops.

**[0:12:18]** So we want to understand what should go here to calculate the gradient of the

**[0:12:21]** loss with respect to all the elements of the lockprops tensor.

**[0:12:25]** Now I'm going to give away the answer here but I wanted to put a quick note

**[0:12:28]** here that I think would be most pedagogically

**[0:12:30]** useful for you is to actually go into the description of this video

**[0:12:34]** and find the link to this Jupyter notebook. You can find it both on github

**[0:12:38]** but you can also find Google collab with it so you don't have to install anything

**[0:12:41]** you'll just go to a website on Google collab and you can try to implement

**[0:12:45]** these derivatives or gradients yourself

**[0:12:48]** and then if you are not able to come to my video and see me do it

**[0:12:52]** and so work in tandem and try it first yourself

**[0:12:54]** and then see me give away the answer and I think that would be most

**[0:12:58]** valuable to you and that's how I recommend you go through this

**[0:13:00]** lecture. So we are starting here with

**[0:13:02]** delockprops. Now delockprops will hold the derivative of the loss with respect to

**[0:13:08]** all the elements of lockprops. What is inside lockprops?

**[0:13:12]** The shape of this is 32 by 27 so it's not going to surprise you that

**[0:13:18]** delockprops should also be an array of size 32 by 27

**[0:13:22]** because we want the derivative of the loss with respect to all of its elements

**[0:13:25]** so the sizes of those are always going to be equal.

**[0:13:29]** Now how does lockprops influence the loss?

**[0:13:34]** Loss is negative lockprops indexed with range of n

**[0:13:39]** and yb and then the mean of that. Now just as a reminder

**[0:13:43]** yb is just basically an array of all the correct indices.

**[0:13:51]** So what we're doing here is we're taking the lockprops array of size 32

**[0:13:54]** by 27 and then we are going in

**[0:14:00]** every single row and in each row we are plugging out

**[0:14:04]** the index 8 and then 14 and 15 and so on. So we're going down the rows

**[0:14:08]** that's the iterator range of n and then we are always plugging out

**[0:14:12]** the index at the column specified by this tensor yb.

**[0:14:16]** So in the 0th row we are taking the 8th column

**[0:14:19]** in the first row we're taking the 14th column etc

**[0:14:23]** and so lockprops at this plugs out all those

**[0:14:29]** lock probabilities of the correct next character in a sequence

**[0:14:32]** so that's what that does and the shape of this or the size of it is of course

**[0:14:36]** 32 because our batch size is 32. So these elements get plugged out

**[0:14:42]** and then their mean and the negative of that becomes loss.

**[0:14:47]** So I always like to work with simpler examples to understand

**[0:14:51]** the numerical form of derivative. What's going on here is once we've

**[0:14:55]** plucked out these examples we're taking the mean and then the

**[0:15:00]** negative. So the loss basically if I can write it

**[0:15:03]** this way is the negative of say a plus b plus c

**[0:15:07]** and the mean of those three numbers would be say negative

**[0:15:10]** would divide three that would be how we achieve the mean of three numbers abc

**[0:15:14]** although we actually have 32 numbers here and so what is

**[0:15:18]** basically d loss by say like da right well if we simplify this expression

**[0:15:24]** mathematically this is negative 1 over 3 of a

**[0:15:26]** and negative plus negative 1 over 3 of b plus negative 1 over 3 of c

**[0:15:33]** and so what is d loss by da it's just negative 1 over 3

**[0:15:36]** and so you can see that if we don't just have ab and c but we have 32 numbers

**[0:15:41]** then d loss by d you know every one of those numbers is going to be 1 over

**[0:15:46]** n more generally because n is the the size of the batch 32 in this case

**[0:15:53]** so d loss by d log props is negative 1 over n

**[0:15:59]** in all these places now what about the other elements inside log props

**[0:16:04]** because log props is large array you see that log props that shape is 32 by

**[0:16:08]** 27 but only 32 of them participate in the

**[0:16:12]** loss calculation so what's the derivative of all the other

**[0:16:16]** most of the elements that do not get plucked out here

**[0:16:20]** well their loss intuitively is zero sorry their gradient intuitively is zero

**[0:16:24]** and that's because they did not participate in the loss

**[0:16:27]** so most of these numbers inside this tensor does not feed into the loss

**[0:16:31]** and so if we were to change these numbers then the loss doesn't change

**[0:16:35]** which is the equivalent of we are saying that the derivative of the loss with

**[0:16:39]** respect to them is zero they don't impact it

**[0:16:43]** so here's a way to implement this derivative then

**[0:16:46]** we start out with torched out zeros of shape 32 by 27

**[0:16:50]** or let's just say instead of doing this because we don't want to hard code

**[0:16:53]** numbers let's do torched out zeros like

**[0:16:56]** log props so basically this is going to create an array of zeros exactly in

**[0:17:00]** the shape of log props and then we need to set

**[0:17:04]** the derivative of negative 1 over n inside exactly these locations

**[0:17:08]** so here's what we can do the log props indexed in the identical way

**[0:17:14]** will be just set to negative 1 over 0 divide n

**[0:17:19]** right just like we derived here so now let me erase

**[0:17:24]** all of these reasoning and then this is the candidate

**[0:17:27]** derivative for the log props let's uncomment the first line

**[0:17:31]** and check that this is correct okay so cmp ran and let's go back to cmp

**[0:17:39]** and you see that what it's doing is it's calculating if

**[0:17:42]** the calculated value by us which is dt is exactly equal to t.grad is

**[0:17:47]** calculated by pytorch and then this is making sure that all of the

**[0:17:51]** elements are exactly equal and then converting this to a single boolean

**[0:17:55]** value because we don't want to boolean tensor we just want to boolean value

**[0:18:00]** and then here we are making sure that okay if they're not exactly equal

**[0:18:04]** maybe they are approximately equal because of some floating point issues

**[0:18:07]** but they're very very close so here we are using tors.allclose

**[0:18:11]** which has a little bit of a wiggle available because sometimes you can get

**[0:18:15]** very very close but if you use a slightly different

**[0:18:18]** calculation because of floating point arithmetic

**[0:18:21]** you can get a slightly different result so this is checking if you get an

**[0:18:25]** approximately close result and then here we are checking the

**[0:18:28]** maximum basically the value that has the highest

**[0:18:31]** difference and what is the difference and the absolute

**[0:18:35]** value difference between those two and so we are printing whether we have an

**[0:18:38]** exact equality and approximate equality and what is the

**[0:18:42]** largest difference and so here we see that we

**[0:18:47]** actually have exact equality and so therefore of course we also have an

**[0:18:50]** approximate equality and the maximum difference is exactly

**[0:18:54]** zero so basically our delockprobs is exactly equal

**[0:18:58]** to what pytorch calculated to be logprobs.grad

**[0:19:01]** in its back propagation so so far we're operating pretty well

**[0:19:06]** okay so let's now continue our back propagation we have that logprobs

**[0:19:09]** depends on probes through a log so all the elements of

**[0:19:13]** probes are being element-wise applied log2

**[0:19:17]** now if we want deepprobs then then remember your micrograd training

**[0:19:22]** we have like a log node it takes in probes and creates

**[0:19:25]** logprobs and deepprobs will be the local derivative

**[0:19:29]** of that individual operation log times

**[0:19:32]** the derivative loss with respect to its output which in this case is

**[0:19:36]** delockprobs so what is the local derivative of this operation

**[0:19:40]** well we are taking log element-wise and we can come here and we can see

**[0:19:43]** well from alpha as your friend that d by dx of log of x is just simply one of

**[0:19:47]** our x so therefore in this case x is

**[0:19:51]** probes so we have d by dx is one over x which is one

**[0:19:55]** of our probes and then this is a local derivative

**[0:19:57]** and then times we want to chain it so this is chain rule

**[0:20:01]** times delockprobs then let me uncomment this

**[0:20:05]** and let me run the cell in place and we see that

**[0:20:08]** the derivative of probes as we calculated here is exactly correct

**[0:20:12]** and so notice here how this works probes that are

**[0:20:16]** probes is going to be inverted and then element-wise multiplied here

**[0:20:20]** so if your probes is very very close to one that means you are

**[0:20:24]** your network is currently predicting the character correctly

**[0:20:27]** then this will become one over one and delockprobs is just passed through

**[0:20:31]** but if your probabilities are incorrectly assigned so if the correct

**[0:20:35]** character here is getting a very low probability

**[0:20:38]** then 1.0 dividing by it will boost this and then multiply by

**[0:20:44]** delockprobs so basically what this line is doing intuitively

**[0:20:47]** is it's taking the examples that have a very low probability currently

**[0:20:51]** assigned and it's boosting their gradient you can look at it that

**[0:20:55]** way. Next up is count some imp so we want the

**[0:21:00]** derivative of this now let me just pause here and kind of

**[0:21:04]** introduce what's happening here in general because i know it's a little

**[0:21:07]** bit confusing we have the loges that come out of the neural net

**[0:21:10]** here what i'm doing is i'm finding the maximum in each row

**[0:21:14]** and i'm subtracting it for the purpose of numerical stability

**[0:21:17]** and we talked about how if you do not do this uh you run numerical issues

**[0:21:21]** if some of the loges take on two large values

**[0:21:23]** because we end up exponentiating them so this is done just for safety

**[0:21:28]** numerically then here's the exponentiation of all the sort of

**[0:21:31]** logits to create our counts and then we want to take the sum

**[0:21:37]** of these counts and normalize so that all of the probes sum to one

**[0:21:41]** now here instead of using one over count sum i use

**[0:21:45]** raised to the power of negative one mathematically they are identical

**[0:21:48]** i just found that there's something wrong with the pytorch implementation

**[0:21:50]** of the backward passive division and it gives like a

**[0:21:54]** weird result but that doesn't happen for star star negative one

**[0:21:58]** so i'm using this formula instead but basically all that's happening here

**[0:22:02]** is we got the logits we want to exponentiate all of them and want to

**[0:22:05]** normalize the counts to create our probabilities it's just that it's

**[0:22:09]** happening across multiple lines so now

**[0:22:15]** here we want to first take the derivative

**[0:22:20]** we want to back propagate into count sum if and then into counts as well

**[0:22:24]** so what should be the count sum if now we actually have to be careful here

**[0:22:29]** because we have to scrutinize and be careful with the shapes

**[0:22:33]** so counts that shape and then count some in that shape

**[0:22:39]** are different so in particular counts is 32 by 27

**[0:22:42]** but this counts some in is 32 by one and so in this

**[0:22:47]** multiplication here we also have an implicit broadcasting

**[0:22:50]** that pytorch will do because it needs to take this column tensor of 32 numbers

**[0:22:54]** and replicate it horizontally 27 times to align these two tensors so it can do an

**[0:22:59]** element-wise multiply so really what this looks like

**[0:23:02]** is the following using a toy example again

**[0:23:06]** what we really have here is just props is counts times count sum if so it's a

**[0:23:09]** c equals a times b but a is three by three and b is just three by one a

**[0:23:15]** column tensor and so pytorch internally replicated this

**[0:23:18]** elements of b and it did that across all the columns

**[0:23:22]** so for example b1 which is the first element of b would be replicated here

**[0:23:26]** across all the columns in this multiplication

**[0:23:29]** and now we're trying to back propagate through this operation to count some

**[0:23:32]** in so when we are calculating this derivative

**[0:23:37]** it's important to realize that these two this looks like a single operation

**[0:23:41]** but actually is two operations applied sequentially

**[0:23:45]** the first operation that pytorch did is it took this column

**[0:23:48]** tensor and replicated it across all the

**[0:23:52]** across all the columns basically 27 times so that's the first operation it's a

**[0:23:55]** replication and then the second operation is the

**[0:23:58]** multiplication so let's first back prop through the

**[0:24:00]** multiplication if these two arrays were of the

**[0:24:04]** same size and we just have a and b of both of them three by three

**[0:24:09]** then how do we how do we back propagate through a multiplication

**[0:24:13]** so if we just have scalars and not tensors then if you have c equals a times b

**[0:24:17]** then what is the derivative of c with respect to b

**[0:24:21]** well it's just a and so that's the local derivative

**[0:24:24]** so here in our case undoing the multiplication and

**[0:24:28]** back prop again through just the multiplication itself which is element

**[0:24:31]** wise is going to be the local derivative which in this case

**[0:24:35]** is simply counts because counts is the a

**[0:24:40]** so it's the local derivative and then times because the chain rule

**[0:24:43]** d props so this here is the derivative

**[0:24:47]** or the gradient but with respect to replicated b

**[0:24:52]** but we don't have a replicated b we just have a single b column

**[0:24:55]** so how do we now back propagate through the replication

**[0:24:59]** and intuitively this b1 is the same variable and it's just reused multiple

**[0:25:03]** times and so you can look at it as being

**[0:25:07]** equivalent to a case with encounter in micrograd

**[0:25:11]** and so here i'm just pulling out a random graph we used in micrograd

**[0:25:14]** we have an example where a single node has its output feeding into two branches

**[0:25:19]** of basically the graph until the last function

**[0:25:23]** and we're talking about how the correct thing to do in the backward pass is

**[0:25:26]** we need to sum all the gradients that arrive at any one node

**[0:25:30]** so across these different branches the gradients would sum

**[0:25:34]** so if a node is used multiple times the gradients for all of its uses

**[0:25:39]** sum during back propagation so here b1 is used multiple times in all these

**[0:25:43]** columns and therefore the right thing to do here

**[0:25:46]** is to sum horizontally across all the rows

**[0:25:51]** so we want to sum in dimension one but we want to retain this dimension so

**[0:25:56]** that the uh so that counts amount and its gradient

**[0:25:59]** are going to be exactly the same shape so we want to make sure that we

**[0:26:02]** keep them as true so we don't lose this dimension

**[0:26:06]** and this will make the count sum inf be exactly shape 32 by 1

**[0:26:11]** so revealing this comparison as well and running this

**[0:26:15]** we see that we get an exact match so this derivative is exactly correct

**[0:26:22]** and let me erase this now let's also back propagate into counts

**[0:26:27]** which is the other variable here to create props so from props to count

**[0:26:32]** sum inf we just did that let's go into counts as well

**[0:26:35]** so d counts will be d counts is our a so dc by d a is just b

**[0:26:44]** so therefore it's count sum inf and then times chain rule d props

**[0:26:51]** now count sum inf is 32 by 1 d props is 32 by 27 so

**[0:26:59]** those will broadcast fine and will give us d counts

**[0:27:03]** there's no additional summation required here um

**[0:27:07]** there will be a broadcasting that happens in this multiply here because

**[0:27:11]** count sum inf needs to be replicated again to correctly multiply

**[0:27:14]** d props but that's going to give the correct result

**[0:27:18]** so as far as the single operation is concerned

**[0:27:21]** so we backpropiate from props to counts but we can't actually

**[0:27:25]** check the derivative of counts i have it much later on

**[0:27:30]** and the reason for that is because count sum inf depends on counts

**[0:27:34]** and so there's a second branch here that we have to finish because count sum inf

**[0:27:38]** backpropagates into count sum and count sum will backpropagate into counts

**[0:27:42]** and so counts is a node that is being used twice it's used right here into

**[0:27:46]** props and it goes through this other branch through count sum inf

**[0:27:50]** so even though we've calculated the first contribution of it we still have

**[0:27:53]** to calculate the second contribution of it later

**[0:27:57]** okay so we're continuing with this branch we have the derivative for count sum inf

**[0:28:01]** now we want the derivative of counts sum so d counts sum equals

**[0:28:05]** what is the local derivative of this operation so this is basically an

**[0:28:08]** element wise one over counts sum so counts sum raised to the power of

**[0:28:13]** negative one is the same as one over counts sum

**[0:28:16]** if we go to all from alpha we see that x to the negative one

**[0:28:19]** d by d by d by dx of it is basically negative x to the negative two

**[0:28:24]** right one negative one over s squared is the same as negative x to the negative two

**[0:28:29]** so d counts sum here will be local derivative

**[0:28:33]** is going to be negative counts sum to the negative two that's the local derivative

**[0:28:40]** times chain rule which is d counts sum inf so that's d counts sum

**[0:28:49]** let's uncomment this and check that i am correct okay so we have perfect equality

**[0:28:55]** and there's no sketchiness going on here with any shapes because these are of the

**[0:28:59]** same shape okay next up we want to back propagate through

**[0:29:02]** this line we have that counts sum is counts dot sum along the rows

**[0:29:07]** so i wrote out some help here we have to keep in mind that counts of

**[0:29:12]** course is 32 by 27 and counts sum is 32 by one so in this

**[0:29:17]** back propagation we need to take this column of the

**[0:29:21]** derivatives and transform it into a array of derivatives

**[0:29:24]** two-dimensional array so what is this operation doing

**[0:29:28]** we're taking in some kind of an input like say a three by three matrix a

**[0:29:32]** and we are summing up the rows into a column tensor

**[0:29:36]** b b1 b2 b3 that is basically this so now we have the derivatives of the

**[0:29:41]** loss with respect to b all the elements of b

**[0:29:45]** and now we want to derivative of the loss with respect to all these

**[0:29:48]** little a's so how do the b's depend on the a's

**[0:29:52]** is basically what we're after what is the local derivative of this operation

**[0:29:56]** well we can see here that b1 only depends on these elements here

**[0:30:01]** the derivative of b1 with respect to all of these elements down here

**[0:30:04]** is zero but for these elements here like a1 1 a1 2 etc the local derivative

**[0:30:09]** is 1 right so db 1 by d a1 1 for example is 1

**[0:30:15]** so it's 1 1 and 1 so when we have the derivative of the

**[0:30:19]** loss with respect to b1 the local derivative of b1

**[0:30:23]** with respect to these inputs is zeroes here but it's 1 on these guys

**[0:30:27]** so in the chain rule we have the local derivative

**[0:30:31]** times sort of the derivative of b1 and so

**[0:30:35]** because the local derivative is 1 on these three elements

**[0:30:39]** the local derivative multiplying the derivative b1

**[0:30:41]** will just be the derivative of b1 and so you can look at it as a router

**[0:30:47]** basically an addition is a router of gradient whatever gradient comes from

**[0:30:51]** above it just gets routed equally to all the elements that participate in that

**[0:30:54]** addition so in this case the derivative of b1

**[0:30:58]** will just flow equally to the derivative of a1 1 a1 2 and a1 3

**[0:31:03]** so if we have a derivative of all the elements of b

**[0:31:06]** and in this column tensor which is d counts sum

**[0:31:09]** that we've calculated just now we basically see that what that amounts to

**[0:31:14]** is all of these are now flowing to all these elements of a

**[0:31:18]** and they're doing that horizontally so basically what we want is we want to

**[0:31:22]** take the d counts sum of size 30 by 1 and we just

**[0:31:26]** want to replicate it 27 times horizontally to create 32 by 27 array

**[0:31:32]** so there's many ways to implement this operation you could of course just

**[0:31:34]** replicate the tensor but i think maybe one clean one is

**[0:31:38]** that d counts is simply torch dot ones like

**[0:31:43]** so just an two-dimensional arrays of ones in the shape of counts

**[0:31:47]** so 32 by 27 times d counts sum so this way we're letting the broadcasting

**[0:31:54]** here basically implement the replication you can look at it that

**[0:31:58]** way but then we have to also be careful

**[0:32:02]** because d counts was already calculated we calculated earlier here

**[0:32:07]** and that was just the first branch and we're now finishing the second branch

**[0:32:10]** so we need to make sure that these gradients add so plus equals

**[0:32:14]** and then here let's comment out the comparison and let's make sure crossing

**[0:32:21]** fingers that we have the correct result so

**[0:32:24]** pytorch agrees with us on this gradient as well

**[0:32:27]** okay hopefully we're getting a hang of this now counts as an element y

**[0:32:31]** x of norm logits so now we want d norm logits

**[0:32:36]** and because it's an element rise operation everything is very simple

**[0:32:39]** what is the local derivative of e to the x it's famously just e to the x

**[0:32:43]** so this is the local derivative that is the local derivative

**[0:32:49]** now we already calculated it and it's inside counts so we made as well

**[0:32:53]** potentially just reuse counts that is the local derivative

**[0:32:56]** times d counts funny as that looks counts times d counts is the derivative

**[0:33:04]** on the norm logits and now let's erase this and let's verify

**[0:33:09]** and it looks good so that's norm logits okay so we are here on this line now

**[0:33:17]** d norm logits we have that and we're trying to

**[0:33:20]** calculate d logits and d logit maxes so back propagating through this line

**[0:33:25]** now we have to be careful here because the shapes again are not the same and

**[0:33:28]** so there's an implicit broadcasting happening here

**[0:33:31]** so norm logits has this shape of 32 by 27 logits does as well

**[0:33:36]** but logit maxes is only 32 by 1 so there's a broadcasting here in the

**[0:33:41]** minus now here i tried to sort of write out a toy example again

**[0:33:46]** we basically have that this is our c equals a minus b

**[0:33:50]** and we see that because of the shape these are three by three but this one

**[0:33:53]** is just a column and so for example every element of

**[0:33:56]** c we have to look at how it came to be

**[0:34:00]** and every element of c is just the corresponding element of a

**[0:34:03]** minus basically that associated b so it's very clear now that the

**[0:34:10]** derivatives of every one of these c's with respect to their inputs

**[0:34:14]** are one for the corresponding a and it's a negative one for the corresponding b

**[0:34:22]** and so therefore the derivatives on the c will flow

**[0:34:28]** equally to the corresponding a's and then also to the corresponding b's

**[0:34:32]** but then in addition to that the b's are broadcast so we'll have to do the

**[0:34:36]** digital sum just like we did before and of course the derivatives for b's

**[0:34:40]** will undergo a minus because the local derivative here is

**[0:34:44]** negative one so dc32 by db3 is negative one so let's just

**[0:34:50]** implement that basically d logits will be

**[0:34:54]** exactly copying the derivative on norm logits so

**[0:34:59]** d logits equals d norm logits and i'll do a dot clone for safety so we're just

**[0:35:05]** making a copy and then we have that d logit maxis

**[0:35:09]** will be the negative of d norm logits because of the negative sign

**[0:35:15]** and then we have to be careful because uh logit maxis

**[0:35:19]** is a column and so just like we saw before

**[0:35:23]** because we keep replicating the same elements across all the columns

**[0:35:28]** then in the backward pass because we keep reusing this

**[0:35:32]** these are all just like separate branches of use of that one variable

**[0:35:36]** and so therefore we have to do a sum along one would keep them equals true

**[0:35:40]** so that we don't destroy this dimension and then d logit maxis will be the

**[0:35:44]** same shape now we have to be careful because this

**[0:35:47]** d logits is not the final d logits and that's because

**[0:35:51]** not only do we get gradient signal into logits through here

**[0:35:55]** but logit maxis is a function of logits and that's a second branch into logits

**[0:36:00]** so this is not yet our final derivative for logits we will come back

**[0:36:03]** later for the second branch for now d logit maxis is the final derivative

**[0:36:08]** so let me uncomment this cmp here and let's just run this

**[0:36:12]** and logit maxis if pytorch agrees with us

**[0:36:16]** so that was the derivative into through this line

**[0:36:21]** now before we move on i want to pause here briefly and i want to look at these

**[0:36:24]** logit maxis and especially their gradients we've talked previously in the

**[0:36:28]** previous lecture that the only reason we're doing this

**[0:36:31]** is for the numerical stability of the softmax that we are implementing

**[0:36:34]** here and we talked about how if you take these logits

**[0:36:38]** for any one of these examples so one row of this logits tensor

**[0:36:42]** if you add or subtract any value equally to all the elements

**[0:36:46]** then the value of the probes will be unchanged you're not changing the softmax

**[0:36:50]** the only thing that this is doing is it's making sure that x doesn't overflow

**[0:36:55]** and the reason we're using a max is because then we are guaranteed that each

**[0:36:58]** row of logits the highest number is zero and so this will be safe

**[0:37:03]** and so basically what that has repercussions if it is the case

**[0:37:10]** that changing logit maxis does not change the probes and

**[0:37:13]** therefore does not change the loss then the gradient on logit maxis should be zero

**[0:37:18]** right because saying those two things is the same

**[0:37:21]** so indeed we hope that this is very very small numbers indeed we hope this is zero

**[0:37:25]** now because of floating point sort of wonkiness

**[0:37:29]** this doesn't come out exactly zero only in some of the rows it does

**[0:37:33]** but we get extremely small values like 1e negative 9 or 10

**[0:37:36]** and so this is telling us that the values of logit maxis are not impacting

**[0:37:40]** the loss as they shouldn't it feels kind of weird to back propagate through

**[0:37:44]** this branch honestly because if you have any

**[0:37:49]** implementation of like f.cross entropy and pytorch and you

**[0:37:52]** you block together all these elements and you're not doing the back propagation

**[0:37:55]** piece by piece then you would probably assume that

**[0:37:58]** the derivative through here is exactly zero so you would be sort of

**[0:38:04]** skipping this branch because it's only done for numerical stability

**[0:38:09]** but it's interesting to see that even if you break up everything into

**[0:38:12]** the full atoms and you still do the computation as you'd like with respect

**[0:38:15]** to numerical stability the correct thing happens

**[0:38:18]** and you still get a very very small gradients here

**[0:38:21]** basically reflecting the fact that the values of these do not matter

**[0:38:25]** with respect to the final loss okay so let's now continue back propagation

**[0:38:29]** through this line here we've just calculated the logit maxis

**[0:38:32]** and now we want to back prompt into logits through this second branch

**[0:38:36]** now here of course we took logits and we took the max along all the rows

**[0:38:40]** and then we looked at its values here now the way this works is that in pytorch

**[0:38:47]** this thing here the max returns both the values

**[0:38:51]** and it returns the indices that reach those values to column the maximum

**[0:38:54]** value now in the forward pass we only

**[0:38:57]** used values because that's all we needed but in the

**[0:39:00]** backward pass it's extremely useful to know about

**[0:39:02]** where those maximum values occurred and we have the indices of which they occurred

**[0:39:07]** and this will of course help us do help us do the back propagation

**[0:39:11]** because what should the backward pass be here in this case

**[0:39:14]** we have the logit tensor which is 32 by 27 and in each row we find the maximum

**[0:39:18]** value and then that value gets plucked out into

**[0:39:21]** logit maxis and so intuitively basically the derivative

**[0:39:27]** flowing through here then should be one

**[0:39:31]** times the local derivatives is one for the appropriate entry that was plucked out

**[0:39:36]** and then times the global derivative of the logit maxis

**[0:39:40]** so really what we're doing here if you think through it is we need to take the

**[0:39:43]** delogit maxis and we need to scatter it to the correct

**[0:39:47]** positions in these logits from where the maximum values came

**[0:39:53]** and so I came up with one line of code sort of that

**[0:39:58]** does that let me just erase a bunch of stuff here

**[0:40:00]** so the line of you could do it kind of very similar to what we done here

**[0:40:03]** where we create a zeros and then we populate the correct

**[0:40:07]** elements so we use the indices here and we would

**[0:40:10]** set them to be one but you can also use one hat

**[0:40:15]** so f dot one hat and then I'm taking the logits of max

**[0:40:19]** over the first dimension that indices and I'm telling

**[0:40:23]** PyTorch that the dimension of every one of these tensors should be

**[0:40:29]** 27 and so what this is going to do is okay I apologize this is crazy

**[0:40:37]** guilty that I am sure of this it's really just an array of where the maxis

**[0:40:41]** came from in each row and that element is one and the

**[0:40:45]** all the other elements are zero so it's a one hat vector in each row

**[0:40:49]** and these indices are now populating a single one

**[0:40:52]** in the proper place and then what I'm doing here is I'm multiplying by the

**[0:40:56]** logit maxis and keep in mind that this is a column

**[0:41:01]** of 32 by one and so when I'm doing this

**[0:41:05]** times the logit maxis the logit maxis will broadcast

**[0:41:09]** and that column will you know get replicated and then element-wise

**[0:41:12]** multiply will ensure that each of these just gets routed

**[0:41:16]** to whichever one of these bits is turned on and so that's another way to

**[0:41:20]** implement this kind of an operation and both of these can be

**[0:41:26]** used I just thought I would show an equivalent way to do it

**[0:41:29]** and I'm using plus equals because we already calculated the logits here

**[0:41:33]** and this is now the second branch so let's

**[0:41:37]** look at logits and make sure that this is correct

**[0:41:40]** and we see that we have exactly the correct answer

**[0:41:44]** next up we want to continue with logits here that is an outcome of a matrix

**[0:41:49]** multiplication and a bias offset in this linear layer

**[0:41:53]** so I've printed out the shapes of all these intermediate

**[0:41:56]** tensors we see that logits is of course 32 by 27

**[0:42:00]** as we've just seen then the h here is 32 by 64 so these are 64

**[0:42:06]** dimensional hidden states and then this w matrix projects

**[0:42:09]** those 64 dimensional vectors into 27 dimensions

**[0:42:13]** and then there's a 27 dimensional offset which is a

**[0:42:16]** one-dimensional vector now we should note that this plus here

**[0:42:20]** actually broadcasts because h multiplied by w2 will give us a 32 by 27

**[0:42:27]** and so then this plus b2 is a 27 dimensional vector here

**[0:42:32]** now in the rules of broadcasting what's going to happen with this bias vector

**[0:42:35]** is that this one-dimensional vector 27 will get aligned

**[0:42:39]** with an padded dimension of one on the left and it will basically become a row

**[0:42:44]** vector and then it will get replicated vertically

**[0:42:47]** 32 times to make it 32 by 27 and then there's an element wise multiply

**[0:42:53]** now the question is how do we back propagate from

**[0:42:56]** logits to the hidden states the weight matrix w2

**[0:43:00]** and the bias b2 and you might think that we need to go to

**[0:43:04]** some matrix calculus and then we have to look up

**[0:43:08]** the derivative for a matrix multiplication but actually you don't

**[0:43:11]** have to do any of that and you can go back to first principles and derive this

**[0:43:14]** yourself on a piece of paper and specifically what I like to do and

**[0:43:18]** what I find works well for me is you find a specific small example

**[0:43:22]** that you then fully write out and then in the process of analyzing how that

**[0:43:26]** individual small example works you will understand the broader pattern

**[0:43:29]** and you'll be able to generalize and write out the full

**[0:43:32]** general formula for how these derivatives flow in an expression

**[0:43:37]** like this so let's try that out so pardon the low budget production here but

**[0:43:41]** what i've done here is i'm writing it out on a piece of paper

**[0:43:44]** really what we are interested in is we have a multiply b

**[0:43:47]** plus c and that creates a d and we have the derivative of the loss with

**[0:43:53]** respect to d and we'd like to know what the derivative of the loss is with

**[0:43:55]** respect to a b and c now these here are a little

**[0:43:59]** two-dimensional examples of a matrix multiplication

**[0:44:02]** two by two times a two by two plus a two a vector of just two elements c one and

**[0:44:08]** c two gives me a two by two now notice here that

**[0:44:12]** i have a bias vector here called c and the bias vector c one and c two

**[0:44:18]** but as i described over here that bias vector will become a row vector in

**[0:44:21]** the broadcasting and will replicate vertically

**[0:44:24]** so that's what's happening here as well c one c two is replicated

**[0:44:27]** vertically and we see how we have two rows of c one c two

**[0:44:31]** as a result so now when i say write it out i just mean

**[0:44:35]** like this basically break up this matrix multiplication

**[0:44:39]** into the actual thing that that's going on under the hood

**[0:44:42]** so as a result of matrix multiplication and how it works

**[0:44:45]** d one one is the result of a dot product between the first row of a

**[0:44:49]** and the first column of b so a one one b one one plus a one two b two one

**[0:44:55]** plus c one and so on so forth for all the other elements of d

**[0:45:01]** and once you actually write it out it becomes obvious this is just a bunch

**[0:45:04]** of multiplies and ads and we know from micrograd

**[0:45:08]** how to differentiate multiplies and ads and so this is not scary anymore it's

**[0:45:12]** not just matrix multiplication it's just tedious unfortunately

**[0:45:16]** but this is completely tractable we have dl by d for all of these

**[0:45:20]** and we want to dl by all these little other variables

**[0:45:24]** so how do we achieve that and how do we actually get the gradients

**[0:45:27]** okay so the low budget production continues here so

**[0:45:31]** let's for example derive the derivative of the loss with respect to

**[0:45:34]** a one one we see here that a one one occurs

**[0:45:37]** twice in our simple expression right here right here and influences d one one

**[0:45:41]** and d one two so this is so what is dl by d

**[0:45:45]** a one one well it's dl by d one one

**[0:45:49]** times the local derivative of d one one which in this case is just b one one

**[0:45:54]** because that's what's multiplying a one one here so

**[0:45:58]** and likewise here the local derivative of d one two with respect to a one one is

**[0:46:02]** just b one two and so b one two will in the chain rule

**[0:46:05]** therefore multiply dl by d one two and then because a one one is

**[0:46:10]** used both to produce d one one and d one two

**[0:46:13]** we need to add up the contributions of both of those

**[0:46:17]** sort of chains that are running in parallel and that's why we get a plus

**[0:46:21]** just adding up those two those two contributions

**[0:46:25]** and that gives us dl by d a one one we can do the exact same analysis for the

**[0:46:30]** other one for all the other elements of a and when you simply write it out

**[0:46:35]** it's just super simple um taking of gradients on

**[0:46:39]** you know expressions like this you find that

**[0:46:44]** this matrix dl by d a that we're after right if we just arrange all of them

**[0:46:49]** in the same shape as a takes so a is just to write your matrix

**[0:46:53]** so dl by d a here will be also just the same shape

**[0:47:00]** tensor with the derivatives now so dl by d a one one etc and we see that

**[0:47:05]** actually we can express what we've written out here

**[0:47:08]** as a matrix multiply and so it just so happens that dl by

**[0:47:13]** that all of these formulas that we've derived here by taking gradients

**[0:47:17]** can actually be expressed as a matrix multiplication and in particular we see

**[0:47:21]** that it is the matrix multiplication of these two

**[0:47:24]** matrices so it is the um dl by d and then matrix multiplying b

**[0:47:31]** but b transpose actually so you see that b two one

**[0:47:34]** and b one two have changed place whereas before we had of course b one

**[0:47:40]** one b one two b two one b two two so you see that this

**[0:47:44]** other matrix b is transposed and so basically what we have

**[0:47:48]** long story short just by doing very simple reasoning here

**[0:47:51]** by breaking up the expression in the case of a very simple example

**[0:47:55]** is that dl by d a is which is this is simply equal to dl by dd

**[0:48:01]** matrix multiplied with b transpose so that is what we have so far

**[0:48:07]** now we also want the derivative with respect to

**[0:48:10]** b and c now for b i'm not actually doing the full derivation because honestly

**[0:48:16]** it's um it's not deep it's just annoying it's

**[0:48:20]** exhausting you can actually do this analysis yourself

**[0:48:23]** you'll also find that if you take this these expressions and you differentiate

**[0:48:26]** with respect to b instead of a you will find that dl by d b

**[0:48:31]** is also a matrix multiplication in this case you have to take the matrix a

**[0:48:35]** and transpose it and matrix multiply that with dl by dd

**[0:48:39]** and that's what gives you a dl by db and then here for the offset c one and c

**[0:48:45]** two if you again just differentiate with respect to c one

**[0:48:49]** you will find an expression like this and c two

**[0:48:53]** an expression like this and basically you will find that dl by dc

**[0:48:57]** is simply because they're just offsetting these expressions

**[0:49:00]** you just have to take the dl by dd matrix

**[0:49:04]** of the derivatives of d and you just have to sum

**[0:49:08]** across the columns and that gives you derivatives for

**[0:49:12]** c so long story short the backward pass of a matrix multiply is a matrix

**[0:49:18]** multiply and instead of just like we had d

**[0:49:21]** equals a times b plus c uh in a scalar case

**[0:49:25]** we sort of like arrive at something very very similar but now

**[0:49:28]** with a matrix multiplication instead of a scalar multiplication

**[0:49:32]** so the derivative of d with respect to a

**[0:49:36]** is um dl by dd matrix multiply b transpose and here it's a transpose

**[0:49:43]** multiply dl by dd but in both cases it's a matrix multiplication

**[0:49:47]** with the derivative and the other term in the

**[0:49:51]** multiplication and for c it is a sum now i'll tell you a secret

**[0:49:57]** i can never remember the formulas that we just arrived for back propaganda

**[0:50:01]** information multiplication and i can back propagate through these

**[0:50:03]** expressions just fine and the reason this works is because the

**[0:50:07]** dimensions have to work out uh so let me give you an example

**[0:50:11]** say i want to create dh then uh what should dh be number one i have to

**[0:50:16]** know that the shape of dh must be the same as the shape of h

**[0:50:21]** and the shape of h is 32 by 64 and then the other piece of information i

**[0:50:25]** know is that uh dh must be some kind of

**[0:50:28]** matrix multiplication of d logits with w2 and d logits is 32 by 27

**[0:50:35]** and w2 is 64 by 27 there is only a single way to make the shape

**[0:50:40]** work out uh in this case and it is indeed the

**[0:50:44]** correct result in particular here h needs to be 32 by 64

**[0:50:48]** the only way to achieve that is to take a d logits

**[0:50:52]** and matrix multiply it with uh you see how i have to take w2 but i have to

**[0:50:57]** transpose it to make the dimensions work out so w2 transpose

**[0:51:01]** and it's the only way to make these to matrix multiply those two pieces to make

**[0:51:05]** the shapes work out and that turns out to be the correct formula

**[0:51:08]** so if we come here uh we want dh which is da and we see that da is

**[0:51:14]** dl by dd matrix multiply b transpose so that's d logits multiply

**[0:51:19]** and b is w2 so w2 transpose which is exactly what we have

**[0:51:24]** here so there's no need to remember these formulas

**[0:51:27]** similarly now if i want uh dw2 well i know that it must be a matrix

**[0:51:33]** multiplication of uh d logits and h and maybe there's a

**[0:51:38]** few transpose like there's one transpose in there as well

**[0:51:40]** and i don't know which way it is so i have to come to w2

**[0:51:43]** and i see that its shape is 64 by 27 and that has to come from

**[0:51:48]** some matrix multiplication of these two and so to get a 64 by 27 i need to

**[0:51:54]** take um h i need to transpose it

**[0:51:59]** and then i need to matrix multiply it um so that will become 64 by 32

**[0:52:03]** and then i need to matrix multiply with the 32 by 27

**[0:52:06]** and that's going to give me a 64 by 27 so i need to matrix multiply this with

**[0:52:10]** the logits that shape just like that that's the only way to make the

**[0:52:13]** dimensions work out and just use matrix multiplication

**[0:52:17]** and if we come here we see that that's exactly what's here so

**[0:52:20]** h transpose a for us is h uh multiply with the logits

**[0:52:26]** so that's w2 and then db2 is just the um vertical sum and actually in the same

**[0:52:35]** way there's only one way to make the shapes work out

**[0:52:38]** i don't have to remember that it's a vertical sum along the zero of axis

**[0:52:41]** because that's the only way that this makes sense because b2 shape is 27

**[0:52:45]** so in order to get a um d logits here is 32 by 27 so

**[0:52:53]** knowing that it's just sum over d logits in some direction

**[0:52:59]** that direction must be zero because i need to eliminate this dimension

**[0:53:04]** so it's this uh so this is so this kind of like the hacky way let me copy paste

**[0:53:09]** and delete that and let me swing over here and this is our backward pass

**[0:53:14]** for the linear layer uh hopefully so now let's uncomment these three and

**[0:53:20]** we're checking that we um got all the three derivatives correct

**[0:53:24]** and uh run and we see that h w2 and b2 are all exactly

**[0:53:30]** correct so we back propagate it through a linear

**[0:53:33]** layer now next up we have derivative for the

**[0:53:38]** h already and we need to back propagate through 10 h into h

**[0:53:42]** preact so we want to derive dh preact

**[0:53:47]** and here we have to back propagate through a 10 h and we've already done this in

**[0:53:50]** micrograd and we remember that 10 h is a very simple backward formula

**[0:53:54]** now unfortunately if i just put in d by dx of 10 h of x

**[0:53:57]** into volt from alpha it lets us down it tells us that it's a

**[0:54:00]** hyperbolic secant function squared of x it's not exactly helpful

**[0:54:05]** but luckily google image search does not let us down

**[0:54:08]** and it gives us the simpler formula and in particular if you have that a

**[0:54:12]** is equal to 10 h of z then da by dz back propagating through 10 h

**[0:54:17]** is just 1 minus a square and take note that

**[0:54:20]** 1 minus a square a here is the output of the 10 h

**[0:54:24]** not the input to the 10 h z so the da by dz is here formulated in terms of the

**[0:54:30]** output of that 10 h and here also in google image

**[0:54:33]** search we have the full derivation if you want to actually take the

**[0:54:37]** actual definition of 10 h and work through the math to figure out

**[0:54:40]** 1 minus 10 h square of z so 1 minus a square is the local derivative

**[0:54:46]** in our case that is 1 minus the output of 10 h

**[0:54:50]** square which here is h so it's h square and that is the local derivative

**[0:54:57]** and then times the chain rule dh so that is going to be our candidate

**[0:55:02]** implementation so if we come here and then

**[0:55:06]** uncomment this let's hope for the best and we have the right answer

**[0:55:12]** okay next up we have bhpact and we want to backpropagate into the gain

**[0:55:16]** the b and raw and the b and bias so here this is the bash norm parameters

**[0:55:21]** b and gain and bias inside the bash norm that take the b and

**[0:55:24]** raw that is exact unit Gaussian and they scale it and shift it

**[0:55:29]** and these are the parameters of the bash norm now here

**[0:55:33]** we have a multiplication but it's worth noting that this multiply is very very

**[0:55:36]** different from this matrix multiply here matrix multiply are dark

**[0:55:40]** products between rows and columns of these matrices involved

**[0:55:44]** this is an element wise multiply so things are quite a bit simpler

**[0:55:48]** now we do have to be careful with some of the broadcasting happening in this

**[0:55:51]** line of code though so you see how b and gain and b and bias

**[0:55:55]** are 1 by 64 but hpact and b and raw are 32 by 64

**[0:56:02]** so we have to be careful with that and make sure that all the shapes work out

**[0:56:05]** fine and that the broadcasting is correctly backpropagated

**[0:56:08]** so in particular let's start with db and gain so

**[0:56:12]** db and gain should be and here this is again

**[0:56:16]** element wise multiply and whenever we have a times b equals c

**[0:56:20]** we saw that the local derivative here is just if this is a the local

**[0:56:23]** derivative is just the b the other one so the local derivative is just b and

**[0:56:27]** raw and then times chain rule so dhpact so this is the candidate

**[0:56:37]** gradient now again we have to be careful because b and gain

**[0:56:41]** is of size 1 by 64 but this here would be 32 by 64

**[0:56:48]** and so the correct thing to do in this case of course

**[0:56:51]** is that b and gain here is a rule vector of 64 numbers

**[0:56:55]** it gets replicated vertically in this operation

**[0:56:58]** and so therefore the correct thing to do is to sum

**[0:57:01]** because it's being replicated and therefore all the gradients

**[0:57:05]** in each of the rows that are now flowing backwards need to sum up

**[0:57:09]** to that same tensor db and gain so if to sum across all the

**[0:57:14]** zero all the examples basically which is the direction which just gets

**[0:57:19]** replicated and now we have to be also careful because

**[0:57:22]** we um b and gain is of shape 1 by 64 so in fact I need to keep them

**[0:57:28]** as true otherwise I would just get 64 now I don't actually really

**[0:57:33]** remember why the b and gain and the b and bias I made them

**[0:57:37]** be 1 by 64 um but the biases b1 and b2 I just made them be one dimensional

**[0:57:44]** vectors they're not two dimensional tensors

**[0:57:47]** so I can't recall exactly why I left the

**[0:57:50]** gain and the bias as two dimensional but it doesn't really matter as long as you

**[0:57:54]** are consistent and you're keeping it the same so in this case we want to keep the

**[0:57:57]** dimension so that the tensor shapes work

**[0:58:01]** next up we have b and raw so db and raw will be

**[0:58:07]** b and gain multiplying dhp react that's our chain rule

**[0:58:14]** now what about the um dimensions of this we have to be careful right so

**[0:58:20]** dhp act is 32 by 64 b and gain is one by 64

**[0:58:26]** so we'll just get replicated and to create this

**[0:58:29]** multiplication which is the correct thing because in a forward pass it also

**[0:58:33]** gets replicated in just the same way so in fact we don't need the brackets

**[0:58:37]** here we're done and the shapes are already correct

**[0:58:40]** and finally for the bias very similar this bias here is very very similar to

**[0:58:46]** the bias we saw in the in the linear layer

**[0:58:48]** and we see that the gradients from hp act will simply flow into the biases

**[0:58:53]** and add up because these are just these are just offsets

**[0:58:56]** and so basically we want this to be dhp act but it needs to sum along the right

**[0:59:02]** dimension and in this case similar to the gain

**[0:59:05]** we need to sum across the 0th dimension the examples

**[0:59:08]** because of the way that the bias gets replicated very quickly

**[0:59:11]** and we also want to have keep them as true

**[0:59:15]** and so this will basically take this and sum it up and give us a one by 64

**[0:59:20]** so this is the candidate implementation it makes all the shapes

**[0:59:24]** work let me bring it up down here and then let me

**[0:59:29]** uncomment these three lines to check that we are getting the

**[0:59:33]** correct result for all the three tensors and indeed we see that all of that

**[0:59:37]** got back propagated correctly so now we get to the batch norm layer

**[0:59:41]** we see how here being gain and being bias are the parameters so the back

**[0:59:45]** propagation ends but being raw now is the output of the

**[0:59:49]** standardization so here what i'm doing of course is i'm

**[0:59:53]** breaking up the batch norm into manageable pieces so we can back

**[0:59:55]** propagate through each line individually but basically what's

**[0:59:58]** happening is uh b and mean i is the sum

**[1:00:03]** so this is the b and mean i i apologize for the variable naming

**[1:00:08]** b and if is x minus mu b and if to is x minus mu squared

**[1:00:14]** here inside the variance b and var is the variance so

**[1:00:19]** sigma square this is b and var and it's basically the sum of squares

**[1:00:25]** so this is the x minus mu squared and then the sum

**[1:00:29]** now you'll notice one departure here here it is normalized as one over m

**[1:00:35]** which is the number of examples here i am normalizing as one over n minus one

**[1:00:39]** instead of m and this is deliberate and i'll come back to that in a bit when we

**[1:00:43]** are at this line it is something called the Bessel's

**[1:00:46]** correction but this is how i want it in our case

**[1:00:51]** b and var in then becomes basically b and var

**[1:00:54]** plus epsilon epsilon is y negative five and then it's one over square root

**[1:01:00]** is the same as raising to the power of negative point five

**[1:01:03]** right because point five is the square root and then negative makes it one over

**[1:01:07]** square root so b and var nth is a one over

**[1:01:11]** this denominator here and then we can see that b and

**[1:01:14]** raw which is the x hat here is equal to the b and

**[1:01:18]** diff the numerator multiplied by the

**[1:01:22]** b and var nth and this line here that creates

**[1:01:26]** h preact was the last piece we've already back propagated through it

**[1:01:31]** so now what we want to do is we are here and we have b and raw

**[1:01:35]** and we have to first back propagate into b and diff

**[1:01:38]** and b and var nth so now we're here and we have d b and raw

**[1:01:43]** and we need to back propagate through this line

**[1:01:46]** now i've written out the shapes here and indeed

**[1:01:50]** b and var nth is a shape one by 64 so there is a

**[1:01:53]** broadcasting happening here that we have to be careful with

**[1:01:56]** but it is just an element wise simple multiplication by now we should be

**[1:02:00]** pretty comfortable with that to get d b and diff

**[1:02:03]** we know that this is just b and var nth multiplied with d b and raw

**[1:02:11]** and conversely to get d b and var nth we need to take b and diff

**[1:02:17]** and multiply that by d b and raw so this is the candidate

**[1:02:23]** but of course we need to make sure that broadcasting is

**[1:02:26]** obeyed so in particular b and var nth multiplying with d b and raw

**[1:02:31]** will be okay and give us 32 by 64 as we expect but d b and var nth

**[1:02:38]** would be taking a 32 by 64 multiplying it by 32 by 64 so this is a 32 by 64

**[1:02:46]** but of course d b this b and var nth is only 1 by 64

**[1:02:51]** so the second line here needs a sum across the examples

**[1:02:56]** and because there's this dimension here we need to make sure that keep them

**[1:03:00]** with this true so this is the candidate

**[1:03:04]** let's erase this and let's swing down here and implement it and then let's comment

**[1:03:11]** out d b and var nth and d b and diff

**[1:03:16]** now we'll actually notice that d b and diff by the way

**[1:03:19]** is going to be incorrect so when i run this

**[1:03:24]** b and var nth is correct b and diff is not correct

**[1:03:28]** and this is actually expected because we're not done

**[1:03:31]** with b and diff so in particular when we slide here we see here that

**[1:03:36]** b and raw is a function of b and diff but actually b and var of

**[1:03:40]** is a function of b and var which is a function of b and diff do

**[1:03:43]** which is a function of b and diff so it comes here so b d and diff

**[1:03:49]** these variable names are crazy i'm sorry it branches out into two branches

**[1:03:53]** and we've only done one branch of it we have to continue our back

**[1:03:56]** propagation and eventually come back to b and diff and then we'll be able to do a

**[1:03:59]** plus equals and get the actual correct gradient

**[1:04:02]** for now it is good to verify that cbmp also works it doesn't just lie to us and

**[1:04:07]** tell us that everything is always correct it can in fact detect when your

**[1:04:11]** gradient is not correct so it's that's good to see as well

**[1:04:14]** okay so now we have the derivative here and we're trying to back propagate

**[1:04:17]** through this line and because we're raising to a power of

**[1:04:20]** negative 0.5 i brought up the power rule and we see that

**[1:04:24]** basically we have that the b and var will now be

**[1:04:27]** we bring down the exponent so negative 0.5 times

**[1:04:32]** x which is this and now raised to the power of negative 0.5 minus 1 which is

**[1:04:37]** negative 1.5 now we would have to also apply a

**[1:04:42]** small chain rule here in our head because we need to take further

**[1:04:46]** derivative of b and var with respect to this

**[1:04:49]** expression here inside the bracket but because this is an element wise operation

**[1:04:53]** and everything is fairly simple that's just 1 and so there's nothing to do there

**[1:04:57]** so this is the local derivative and then times the global derivative to create

**[1:05:01]** the chain rule this is just times d b and var

**[1:05:05]** so this is our candidate let me bring this down

**[1:05:10]** and uncomment the check and we see that we have the

**[1:05:15]** correct result now before we back propagate through the next line

**[1:05:19]** i wanted to briefly talk about the note here where i'm using the best

**[1:05:22]** correction dividing by n minus 1 instead of dividing by

**[1:05:25]** n when i normalize here the sum of squares now you'll notice that this is the

**[1:05:30]** part you from the paper which uses 1 over n instead

**[1:05:34]** not 1 over n minus 1 there m is rn and so it turns out that there are two

**[1:05:40]** ways of estimating variance of n array one is the biased estimate which is

**[1:05:46]** 1 over n and the other one is the unbiased

**[1:05:48]** estimate which is 1 over n minus 1 now confusingly in the paper this is

**[1:05:53]** not very clearly described and also it's a detail that kind of matters

**[1:05:57]** i think they are using the biased version at training time

**[1:06:01]** but later when they are talking about the inference

**[1:06:04]** they are mentioning that when they do the inference they are using the

**[1:06:07]** unbiased estimate which is the n minus 1 version

**[1:06:11]** in basically for inference and to calibrate the

**[1:06:17]** running mean and the running variance basically

**[1:06:20]** and so they actually introduce a train test mismatch

**[1:06:23]** where in training they use the biased version and in the and test time they

**[1:06:26]** use the unbiased version i find this extremely confusing

**[1:06:30]** you can read more about the Bessel's correction

**[1:06:32]** and why dividing by n minus 1 gives you a better estimate of the variance

**[1:06:36]** in a case where you have population size it or samples for a population

**[1:06:41]** they are very small and that is indeed the case for us because

**[1:06:45]** we are dealing with mini-batches and these mini-batches are a small sample

**[1:06:49]** of a larger population which is the entire training set

**[1:06:52]** and so it just turns out that if you just estimate it using 1 over n

**[1:06:56]** that actually almost always underestimates the variance

**[1:06:59]** and it is a biased estimator and it is advised that you use the unbiased

**[1:07:03]** version and divide by n minus 1 and you can go through this article here

**[1:07:06]** that i liked that actually describes the fall of reasoning and i'll link it

**[1:07:10]** in the video description now when you calculate the torsted variance

**[1:07:15]** you'll notice that they take the unbiased flag whether or not you want to

**[1:07:18]** divide by n or n minus 1 confusingly they do not

**[1:07:22]** mention what the default is for unbiased but i believe

**[1:07:26]** unbiased by default is true i'm not sure why the docs here don't

**[1:07:29]** cite that now in the batch norm 1d the

**[1:07:34]** documentation again is kind of wrong and confusing it says that

**[1:07:37]** the standard deviation is calculated via the biased estimator

**[1:07:41]** but this is actually not exactly right and people have pointed out that it

**[1:07:44]** is not right in a number of issues since then

**[1:07:47]** because actually the rabbit hole is deeper and they follow the paper exactly

**[1:07:52]** and they use the biased version for training but when they're estimating

**[1:07:55]** the running standard deviation we are using the unbiased version

**[1:07:59]** so again there's the train test mismatch so long story short

**[1:08:03]** i'm not a fan of train test discrepancies i basically kind of

**[1:08:07]** consider the fact that we use the biased version the

**[1:08:10]** training time and the unbiased test time i basically consider this to be a bug

**[1:08:15]** and i don't think that there's a good reason for that it's not really they

**[1:08:18]** don't really go into the detail of the reasoning behind it in this paper

**[1:08:21]** so that's why i basically prefer to use the bestest correction

**[1:08:25]** in my own work unfortunately batch norm does not take

**[1:08:28]** a keyword argument that tells you whether or not

**[1:08:31]** you want to use the unbiased version of the biased version in both training

**[1:08:34]** test and so therefore anyone using batch normalization

**[1:08:37]** basically in my view has a bit of a bug in the code

**[1:08:42]** and this turns out to be much less of a problem if your batch

**[1:08:45]** mini batch sizes are a bit larger but still i just find kind of

**[1:08:49]** unpalatable so maybe someone can explain why this is okay

**[1:08:52]** but for now i prefer to use the unbiased version consistently both

**[1:08:56]** during training and at test time and that's why i'm using

**[1:08:59]** one over n minus one here okay so let's now actually back propagate through

**[1:09:03]** this line so the first thing that i always

**[1:09:08]** like to do is i like to scrutinize the shapes first

**[1:09:10]** so in particular here looking at the shapes of what's involved

**[1:09:14]** i see that b and var shape is one by 64 so it's a row vector and b and if two

**[1:09:19]** dot shape is 32 by 64 so clearly here we're

**[1:09:23]** doing a sum over the 0th axis to squash the first dimension

**[1:09:29]** of the shapes here using a sum so that right away actually hints to me

**[1:09:35]** that there will be some kind of a replication or broadcasting in the

**[1:09:38]** backward pass and maybe you're noticing the pattern here but

**[1:09:41]** basically anytime you have a sum in the forward pass that turns into a

**[1:09:46]** replication or broadcasting in the backward pass along the same dimension

**[1:09:49]** and conversely when we have a replication or a

**[1:09:53]** broadcasting in the forward pass that indicates a variable reuse

**[1:09:57]** and so in the backward pass that turns into a sum over the exact same dimension

**[1:10:02]** and so hopefully you're noticing that duality that those two are kind of like

**[1:10:05]** the opposite of each other in the forward and the backward pass

**[1:10:09]** now once we understand the shapes the next thing i like to do always is i

**[1:10:12]** like to look at a toy example in my head to sort of just like understand

**[1:10:15]** roughly how the variable the variable dependencies go

**[1:10:19]** in the mathematical formula so here we have a two-dimensional

**[1:10:23]** array at the end of two which we are scaling by a constant

**[1:10:27]** and then we are summing vertically over the columns

**[1:10:31]** so if we have a two-by-two matrix a and then we sum over the columns and scale

**[1:10:35]** we would get a row vector b1 b2 and b1 depends on a in this way

**[1:10:40]** where it's just sum that's scaled of a and b2 in this way where it's the

**[1:10:45]** second column summed and scaled and so looking at this

**[1:10:50]** basically what we want to do now is we have the derivatives on b1 and b2

**[1:10:55]** and we want to back propagate them into a's and so it's clear that just

**[1:10:58]** differentiating in your head the local derivative here is 1 over

**[1:11:01]** n minus 1 times 1 for each one of these a's

**[1:11:07]** and basically the derivative of b1 has to flow

**[1:11:11]** through the columns of a scaled by 1 over n minus 1

**[1:11:16]** and that's roughly what's happening here so intuitively the derivative flow

**[1:11:20]** tells us that db and df2 will be the local derivative of this operation

**[1:11:28]** and there are many ways to do this by the way but i like to do something like

**[1:11:31]** this torched out one slike of b and df2 so i'll

**[1:11:35]** create a large array two-dimensional of ones and then i will scale it so

**[1:11:41]** 1.0 divide by n minus 1 so this is a array of

**[1:11:47]** 1 over n minus 1 and that's sort of like the local derivative

**[1:11:50]** and now for the chain rule i will simply just multiply it

**[1:11:54]** by db and var and notice here what's going to happen this is 32 by 64 and

**[1:12:01]** this is just 1 by 64 so i'm letting the broadcasting do the

**[1:12:06]** replication because internally in pi torch

**[1:12:09]** basically db and var which is 1 by 64 row vector

**[1:12:13]** will in this multiplication get copied vertically

**[1:12:17]** until the two are of the same shape and then there will be an element wise

**[1:12:19]** multiply and so that the broadcasting is

**[1:12:23]** basically doing the replication and i will end up with the derivatives

**[1:12:26]** of db and df2 here so this is the candidate solution

**[1:12:31]** let's bring it down here let's uncomment this line

**[1:12:35]** where we check it and let's hope for the best

**[1:12:39]** and indeed we see that this is the correct formula next up

**[1:12:43]** let's differentiate here into b and df so here we have that

**[1:12:46]** b and df is element wise squared to create b and df2

**[1:12:50]** so this is a relatively simple derivative because it's a simple

**[1:12:54]** element wise operation so it's kind of like the scalar case

**[1:12:57]** and we have that db and df should be

**[1:13:00]** if this is x squared then the derivative of this is 2x

**[1:13:03]** right so it's simply 2 times b and df that's the local derivative

**[1:13:08]** and then times chain rule and the shape of these is the same

**[1:13:12]** they are of the same shape so times this so that's the backward pass for this

**[1:13:17]** variable let me bring it down here and now we have to be careful because we

**[1:13:21]** already calculated db and df right so this is just the end of the

**[1:13:26]** other you know other branch coming back to

**[1:13:29]** b and df because b and df was already back propagated to

**[1:13:33]** way over here from b and raw so we now completed the second branch and so

**[1:13:38]** that's why i have to do plus equals and if you recall we had an incorrect

**[1:13:43]** derivative for b and df before and i'm hoping that once we

**[1:13:46]** append this last missing piece that we have the exact correctness

**[1:13:50]** so let's run and b and df2 uh b and df now

**[1:13:54]** actually shows the exact correct derivative so

**[1:13:58]** that's comforting okay so let's now back propagate through this line here

**[1:14:02]** um the first thing we do of course is we check the shapes

**[1:14:05]** and i wrote them out here and basically the shape of this is 32 by 64

**[1:14:10]** hpbn is the same shape but b and min i is a

**[1:14:14]** row vector 1 by 64 so this minus here will actually do broadcasting and so

**[1:14:19]** we have to be careful with that and as a hint to us again because of the

**[1:14:22]** duality a broadcasting in the forward pass

**[1:14:25]** means variable reuse and therefore there will be a sum in the backward pass

**[1:14:30]** so let's write out the backward pass here now um

**[1:14:34]** back propagating to the hpbn because this is these are the same shape

**[1:14:39]** then the local derivative for each one of the elements here is just one

**[1:14:42]** for the corresponding element in here so basically what this means is that the

**[1:14:47]** gradient just simply copies it's just a variable assignment it's

**[1:14:51]** quality so i'm just going to clone this tensor

**[1:14:54]** just for safety to create an exact copy of um db and df and then here to

**[1:15:00]** back propagate into this one what i'm inclined to do here is

**[1:15:06]** dbn min i will basically be uh what is the local derivative well it's

**[1:15:12]** negative torch dot ones like of the shape of uh b and df right

**[1:15:22]** and then times the um derivative here db and df

**[1:15:32]** and this here is the back propagation for the replicated

**[1:15:36]** b and min i so i still have to back propagate

**[1:15:39]** through the uh replication in the broadcasting and i do that by doing a

**[1:15:43]** sum so i'm going to take this whole thing and

**[1:15:45]** i'm going to do a sum over the zero dimension which was the

**[1:15:49]** replication so if you scrutinize this by the way

**[1:15:55]** you'll notice that this is the same shape as that and so what i'm doing

**[1:15:59]** what i'm doing here doesn't actually make that much sense because it's just a

**[1:16:03]** uh array of ones multiplying db and df so in fact i can just do

**[1:16:08]** this um and that is equivalent so this is the candidate

**[1:16:13]** backward pass let me copy it here and then let me

**[1:16:18]** comment out this one and this one

**[1:16:22]** enter and it's wrong damn actually sorry this is supposed to be wrong

**[1:16:31]** and it's supposed to be wrong because we are back propagating from

**[1:16:35]** a b and df into hpbn and but we're not done because

**[1:16:40]** dm min i depends on hpbn and there will be a second portion of

**[1:16:44]** that derivative coming from this second branch so we're not done yet and we

**[1:16:48]** expect it to be incorrect so there you go

**[1:16:50]** so let's now back propagate from b and min i into hpbn

**[1:16:57]** and so here again we have to be careful because there's a broadcasting along

**[1:17:01]** or there's a sum along the zero dimension so this will turn into broadcasting

**[1:17:05]** in the backward pass now and i'm going to go a little bit faster on this line

**[1:17:09]** because it is very similar to the line that we had before

**[1:17:12]** and multiple lines in the past in fact so dhpbn

**[1:17:18]** will be uh the gradient will be scaled by one over n

**[1:17:23]** and then basically this gradient here on dbn min i

**[1:17:27]** is going to be scaled by one over n and then it's going to

**[1:17:30]** flow across all the columns and deposit itself into the hpbn

**[1:17:35]** so what we want is this thing scaled by one over n

**[1:17:39]** let me put the constant up front here um so scale down the gradient and now we

**[1:17:47]** need to replicate it across all the um across all the

**[1:17:52]** rows here so we i like to do that by torch dot

**[1:17:56]** once like of basically um hpbn and i will let

**[1:18:04]** broadcasting do the work of um replication so

**[1:18:16]** so this is uh the hpbn and hopefully we can plus equals that

**[1:18:27]** so this here is broadcasting um and then this is the scaling

**[1:18:31]** so this should be correct okay so that completes the back propagation of the

**[1:18:37]** bathroom layer and we are now here let's back propagate through the linear

**[1:18:40]** layer one here now because everything is getting a

**[1:18:43]** little vertically crazy i copy pasted the line here and

**[1:18:47]** let's just back propagate through this one line

**[1:18:50]** so first of course we inspect the shapes and we see that

**[1:18:53]** this is 32 by 64 mcat is uh 32 by 30 w1 is 30 by 64

**[1:19:01]** and b1 is just 64 so as i mentioned back propagating through

**[1:19:06]** linear layers is fairly easy just by matching the shapes

**[1:19:09]** so let's do that we have that d mcat

**[1:19:14]** should be um some matrix multiplication of dhpbn

**[1:19:18]** with uh w1 and one transpose thrown in there

**[1:19:22]** so to make uh mcat be 32 by 30 i need to take uh dhpbn 32 by 64

**[1:19:33]** and multiply it by w1 dot transpose to get d w1 i need to end up with

**[1:19:43]** 30 by 64 so to get that i need to take uh mcat transpose

**[1:19:51]** and multiply that by uh dhpbn and finally to get db1

**[1:20:01]** this is a addition and we saw that basically i need to just sum

**[1:20:06]** the elements in dhpbn along some dimension

**[1:20:09]** and to make the dimensions work out i need to sum along the zero

**[1:20:13]** axis here to eliminate this dimension and we do not keep dims

**[1:20:19]** so that we want to just get a single one dimensional vector of 64

**[1:20:23]** so these are the claimed derivatives let me put that here and let me

**[1:20:29]** uncommon three lines and cross our fingers

**[1:20:33]** everything is great okay so we now continue almost there

**[1:20:37]** we have the derivative of mcat and we want to derivative

**[1:20:40]** we want to back propagate into mb so i again copied this line over here

**[1:20:46]** so this is the forward pass and then this is the shapes

**[1:20:49]** so remember that the shape here was 32 by 30

**[1:20:52]** and the original shape of mb was 32 by 3 by 10

**[1:20:56]** so this layer in the forward pass as you recall did the concatenation

**[1:21:00]** of these three 10 dimensional character vectors

**[1:21:04]** and so now we just want to undo that so this is actually relatively

**[1:21:08]** straightforward operation because the backward pass of the what is

**[1:21:12]** the view view is just a reprint representation of the

**[1:21:14]** array it's just a logical form of how you interpret the array

**[1:21:18]** so let's just reinterpret it to be what it was before

**[1:21:21]** so in other words dm is not 32 by 30 it is basically dmcat

**[1:21:29]** but if you view it as the original shape so just m dot shape

**[1:21:37]** you can you can pass some tuples into view and so this should just be

**[1:21:42]** okay we just re-represent that view and then we

**[1:21:47]** uncomment this line here and hopefully yeah so the derivative of m is correct

**[1:21:55]** so in this case we just had to re-represent the shape of those derivatives

**[1:21:57]** into the original view so now we are at the final line

**[1:22:01]** and the only thing that's left to back propagate through is this

**[1:22:04]** indexing operation here m is c at xb so as i did before i copy pasted this line

**[1:22:09]** here and let's look at the shapes of everything that's

**[1:22:12]** involved and remind ourselves how this worked

**[1:22:15]** so m dot shape was 32 by 3 by 10 so it's 32 examples and then we have

**[1:22:22]** three characters each one of them has a 10 dimensional embedding

**[1:22:26]** and this was achieved by taking the lookup table c which have 27 possible

**[1:22:31]** characters each of them 10 dimensional

**[1:22:34]** and we looked up at the rows that were specified inside this tensor xb

**[1:22:41]** so xb is 32 by 3 and it's basically giving us for each example the identity

**[1:22:45]** or the index of which character is part of that

**[1:22:49]** example and so here i'm showing the first five rows

**[1:22:53]** of this tensor xb and so we can see that for example here

**[1:22:58]** it was the first example in this batch is that the first character

**[1:23:02]** and the first character and the fourth character comes into the neural net

**[1:23:06]** and then we want to predict the next character in a sequence after

**[1:23:09]** the character is 114 so basically what's happening here

**[1:23:13]** is there are integers inside xb and each one of these integers is

**[1:23:18]** specifying which row of c we want to pluck out

**[1:23:23]** right and then we arrange those rows that we've

**[1:23:25]** plucked out into 32 by 3 by 10 tensor and we just package them in

**[1:23:30]** we just package them into this tensor and now what's happening is that we have

**[1:23:35]** dimp so for every one of these basically plucked out rows

**[1:23:40]** we have their gradients now but they're arranged inside this 32 by 3 by 10

**[1:23:45]** tensor so all we have to do now is we just need to route this gradient

**[1:23:50]** backwards through this assignment so we need to find which row of c

**[1:23:54]** did every one of these 10 dimensional embeddings come from

**[1:23:59]** and then we need to deposit them into dc so we just need to undo the indexing

**[1:24:05]** and of course if any of these rows of c was used multiple times

**[1:24:09]** which almost certainly is the case like the row one and one was used multiple

**[1:24:12]** times then we have to remember that the

**[1:24:14]** gradients that arrive there have to add so for each occurrence we have to

**[1:24:19]** have an addition so let's now write this out

**[1:24:22]** and i don't actually know of like a much better way to do this than a for loop

**[1:24:25]** unfortunately in python so maybe someone can come up with a

**[1:24:29]** vectorized efficient operation but for now let's just use

**[1:24:32]** for loops so let me create torsion dot zeros like

**[1:24:37]** c to initialize just 27 by 10 tensor of all zeros and then honestly

**[1:24:44]** for k in range xb dot shape at zero

**[1:24:49]** maybe someone has a better way to do this but for j in range

**[1:24:52]** xb dot shape at one this is going to iterate over all the

**[1:24:58]** all the elements of xb all these integers

**[1:25:03]** and then let's get the index at this position

**[1:25:06]** so the index is basically xb at kj so that an example of that like is 11

**[1:25:14]** or 14 and so on and now in the forward pass

**[1:25:18]** we took we basically took um the row of c at index

**[1:25:26]** and we deposited it into m at kj that's what happened that's where they are

**[1:25:32]** packaged so now we need to go backwards and we just need to route

**[1:25:36]** dm at the position kj we now have these derivatives for each

**[1:25:43]** position and it's 10 dimensional and you just

**[1:25:46]** need to go into the correct row of c so dc rather at ix

**[1:25:52]** is this but plus equals because there could be multiple occurrences

**[1:25:57]** like the same row could have been used many many times

**[1:26:00]** and so all of those derivatives will just

**[1:26:04]** go backwards through the indexing and they will add

**[1:26:07]** so this is my candidate solution let's copy it here

**[1:26:16]** let's uncomment this and cross our fingers

**[1:26:21]** hey so that's it we've back propagated through

**[1:26:25]** this entire beast so there we go totally made sense

**[1:26:31]** so now we come to exercise two it basically turns out that in this first

**[1:26:34]** exercise we were doing way too much work we were back propagating way too

**[1:26:38]** much and it was all good practice and so on

**[1:26:40]** but it's not what you would do in practice and the reason for that is for

**[1:26:44]** example here i separated out this loss calculation over multiple lines

**[1:26:48]** and i broke it up all all too like its smallest atomic pieces and we back

**[1:26:52]** propagated through all of those individually but it turns out that if you

**[1:26:56]** just look at the mathematical expression for the loss

**[1:26:59]** then actually you can do the differentiation on pen and paper

**[1:27:03]** and a lot of terms cancel and simplify and a mathematical expression you

**[1:27:07]** end up with can be significantly shorter and easier to implement

**[1:27:10]** than back propagating through all the little pieces of everything you've

**[1:27:12]** done so before we had this complicated forward

**[1:27:16]** pass going from logits to the loss but in PyTorch

**[1:27:20]** everything can just be glued together into a single call f.crossentropy

**[1:27:23]** you just pass in logits and the labels and you get the exact same loss

**[1:27:27]** as i verify here so our previous loss and the fast loss

**[1:27:30]** coming from the chunk of operations as a single mathematical expression

**[1:27:35]** is the same but it's much much faster in a forward pass

**[1:27:38]** it's also much much faster in backward pass and the reason for that is if

**[1:27:42]** you just look at the mathematical form of this and differentiate again you

**[1:27:45]** will end up with a very small and short expression

**[1:27:47]** so that's what we want to do here we want to in a single operation or in a

**[1:27:51]** single go or like very quickly go directly into

**[1:27:55]** delogits and we need to implement delogits

**[1:27:58]** as a function of logits and yb's but it will be significantly shorter

**[1:28:04]** than whatever we did here where to get to delogits we had to go

**[1:28:08]** all the way here so all of this work can be skipped

**[1:28:11]** in a much much simpler mathematical expression that you can implement here

**[1:28:16]** so you can give it a shot yourself basically look at

**[1:28:20]** what exactly is the mathematical expression of loss

**[1:28:23]** and differentiate with respect to the logits so let me show you

**[1:28:27]** a hint you can of course try it fully yourself

**[1:28:31]** but if not i can give you some hint of how to get started mathematically

**[1:28:36]** so basically what's happening here is we have logits

**[1:28:39]** then there's a softmax that takes the logits and gives you probabilities

**[1:28:43]** then we are using the identity of the correct next character to pluck out a

**[1:28:47]** row of probabilities take the negative log of it

**[1:28:51]** to get our negative log probability and then we average up

**[1:28:54]** all the log probabilities or negative log probabilities to get our loss

**[1:28:59]** so basically what we have is for a single individual example rather

**[1:29:03]** we have that loss is equal to negative log probability

**[1:29:07]** where p here is kind of like thought of as a vector of all the probabilities

**[1:29:12]** so at the y-th position where y is the label

**[1:29:16]** and we have that p here of course is the softmax

**[1:29:20]** so the i-th component of p of this probability vector

**[1:29:24]** is just the softmax function so raising all the logits

**[1:29:30]** basically to the power of e and normalizing so everything sums to one

**[1:29:35]** now if you write out p of y here you can just write out the softmax

**[1:29:39]** and then basically what we're interested in is we're interested in the derivative

**[1:29:42]** of the loss with respect to the i-th logit

**[1:29:47]** and so basically it's a d by d li of this expression here

**[1:29:52]** where we have l indexed with the specific label y

**[1:29:55]** and on the bottom we have a sum over j of e to the lj and the negative

**[1:29:59]** log of all that so potentially give it a shot pen and

**[1:30:02]** paper and see if you can actually derive the expression

**[1:30:04]** for the loss by d li and then we're going to implement it

**[1:30:08]** here okay so i'm going to give away the result here

**[1:30:11]** so this is some of the math i did to derive the gradients

**[1:30:15]** analytically and so we see here that i'm just applying the rules of calculus

**[1:30:19]** from your first or second year of bachelor's degree if you took it

**[1:30:22]** and we see that the expression is actually simplified quite a bit you have

**[1:30:26]** to separate out the analysis in the case where the i-th index that you're

**[1:30:29]** interested in inside logits is either equal to the label

**[1:30:33]** or it's not equal to the label and then the expression is simplified and

**[1:30:36]** canceled in a slightly different way and what we end up with is something very

**[1:30:39]** very simple we either end up with basically p

**[1:30:43]** and i where p is again this vector of

**[1:30:46]** probabilities after a softmax or p and i minus one

**[1:30:49]** where we just simply subtract one but in any case we just need to

**[1:30:53]** calculate the softmax p and then in the correct dimension

**[1:30:57]** we need to subtract one and that's the gradient the form that it takes

**[1:31:00]** analytically um so let's implement this basically

**[1:31:03]** and we have to keep in mind that this is only done for a single example

**[1:31:07]** but here we are working with batches of examples so we have to

**[1:31:10]** be careful of that and then the loss for a batch

**[1:31:13]** is the average loss over all the examples so in other words is the

**[1:31:17]** example for all the individual examples is the loss for each individual

**[1:31:20]** example summed up and then divided by n and we have to

**[1:31:24]** back propagate through that as well and be careful with it

**[1:31:27]** so d logits is going to be f dot softmax

**[1:31:32]** uh pytorch has a softmax function that you can call

**[1:31:35]** and we want to apply the softmax on the logits and we want to go in the

**[1:31:39]** dimension that is one so basically we want to

**[1:31:43]** do the softmax along the rows of these logits

**[1:31:47]** then at the correct positions we need to subtract a one

**[1:31:50]** so d logits at iterating over all the rows

**[1:31:54]** and indexing into the columns provided by the

**[1:31:58]** correct labels inside yb we need to subtract one

**[1:32:03]** and then finally it's the average loss that is the loss

**[1:32:06]** and in the average there's a one over n of all the losses added up

**[1:32:10]** and so we need to also back propagate through that division

**[1:32:14]** so the gradient has to be scaled down by by n as well

**[1:32:18]** because of the mean but this otherwise should be the result

**[1:32:22]** so now if we verify this we see that we don't get an exact match

**[1:32:27]** but at the same time the maximum difference from

**[1:32:31]** logits from pytorch and rd logits here

**[1:32:35]** is on the order of 5e negative 9 so it's a tiny tiny number

**[1:32:39]** so because of floating point wantiness we don't get the exact bitwise

**[1:32:43]** result but we basically get the correct answer

**[1:32:47]** approximately now i'd like to pause here briefly before we move on to the next

**[1:32:51]** exercise because i'd like us to get an intuitive sense of what d logits is

**[1:32:56]** because it has a beautiful and very simple explanation honestly

**[1:33:00]** so here i'm taking the logits and i'm visualizing it

**[1:33:04]** and we can see that we have a batch of 32 examples of 27 characters

**[1:33:08]** and what is the logits intuitively right the logits is the

**[1:33:12]** probabilities that the probabilities matrix in a forward pass

**[1:33:15]** but then here these black squares are the positions of the correct indices where

**[1:33:19]** we subtracted a 1 and so what is this doing right

**[1:33:23]** these are the derivatives on the logits and so

**[1:33:28]** let's look at just the first row here so that's what i'm doing here i'm

**[1:33:33]** calculating the probabilities of these logits and that i'm taking just the

**[1:33:35]** first row and this is the probability row

**[1:33:38]** and then the logits of the first row and multiplying by n

**[1:33:42]** just for us so that we don't have the scaling by an

**[1:33:45]** in here and everything is more interpretable we see that it's exactly

**[1:33:49]** equal to the probability of course but then the position of the correct

**[1:33:52]** index has a minus equals one so minus one on that position

**[1:33:57]** and so notice that if you take the logits at zero

**[1:34:01]** and you sum it it actually sums to zero

**[1:34:05]** and so you should think of these gradients here

**[1:34:09]** at each cell as like a force we are going to be basically pulling down

**[1:34:15]** on the probabilities of the incorrect characters

**[1:34:18]** and we're going to be pulling up on the probability at the correct index

**[1:34:23]** and that's what's basically happening in each row

**[1:34:27]** and the the amount of push and pull is exactly

**[1:34:31]** equalized because the sum is zero so the amount to which we pulled down on the

**[1:34:35]** probabilities and the amount that we push up on the

**[1:34:38]** probability of the correct character is equal so the

**[1:34:42]** the repulsion and the attraction are equal and think of the neural net now

**[1:34:46]** as a as a like a massive pulley system or something

**[1:34:49]** like that we're up here on top of the logits and we're pulling up

**[1:34:53]** we're pulling down the probabilities of incorrect and pulling up the

**[1:34:55]** probability of the correct and in this complicated pulley system because

**[1:34:59]** everything is mathematically just determined

**[1:35:01]** just think of it as sort of like this tension translating to this

**[1:35:05]** complicating pulley mechanism and then eventually we get a tug

**[1:35:08]** on the weights and the biases and basically in each update we just kind

**[1:35:12]** of like tug in the direction that we'd like for each of these elements

**[1:35:15]** and the parameters are slowly given in to the tug and that's what training

**[1:35:19]** neural net kind of like looks like on a high level

**[1:35:22]** and so I think the the forces of push and pull in these gradients

**[1:35:26]** are actually very intuitive here we're pushing and pulling

**[1:35:29]** on the correct answer and the incorrect answers and the amount of force that

**[1:35:33]** we're applying is actually proportional to the probabilities

**[1:35:37]** that came out in the forward pass and so for example if our probabilities came

**[1:35:41]** out exactly correct so they would have had zero

**[1:35:44]** everywhere except for one at the correct position

**[1:35:47]** then the the logits would be all a row of zeros for that example

**[1:35:51]** there would be no push and pull so the amount to which your prediction

**[1:35:55]** is incorrect is exactly the amount by which you're going to get a pull

**[1:35:59]** or push in that dimension so if you have for example a very

**[1:36:03]** confidently mispredicted element here then what's going to happen is that

**[1:36:08]** element is going to be pulled down very heavily

**[1:36:11]** and the correct answer is going to be pulled up to the same amount

**[1:36:15]** and the other characters are not going to be influenced too much

**[1:36:19]** so the amount to which you mispredict is then proportional to the

**[1:36:22]** strength of the pull and that's happening independently in all the

**[1:36:26]** dimensions of this of this tensor and it's sort of very

**[1:36:29]** intuitive and very easy to think through and that's basically the magic

**[1:36:32]** of the cross entropy loss and what it's doing dynamically

**[1:36:35]** in the backward pass of the neural net so now we get to exercise number three

**[1:36:40]** which is a very fun exercise depending on your definition of fun

**[1:36:44]** and we are going to do for batch normalization exactly what we did for

**[1:36:47]** cross entropy loss in exercise number two

**[1:36:49]** that is we are going to consider it as a glued single mathematical expression

**[1:36:53]** and back propagate through it in a very efficient manner because we are going to

**[1:36:56]** derive a much simpler formula for the backward pass of batch normalization

**[1:37:01]** and we're going to do that using pen and paper so previously we've broken up

**[1:37:04]** batch normalization into all of the little intermediate pieces and all

**[1:37:07]** the atomic operations inside it and then we back propagate it through it

**[1:37:11]** one by one now we just have a single sort of

**[1:37:15]** forward pass of a batch term and it's all glued together

**[1:37:20]** and we see that we get the exact same result as before

**[1:37:23]** now for the batch backward pass we'd like to also implement

**[1:37:26]** a single formula basically for back propagating through this entire

**[1:37:29]** operation that is the batch normalization so in the forward

**[1:37:32]** pass previously we took hprevn the hidden states of the

**[1:37:37]** pre batch normalization and created hpreact

**[1:37:40]** which is the hidden states just before the activation

**[1:37:44]** in the batch normalization paper hprevn is x and hpreact is y

**[1:37:49]** so in the backward pass what we'd like to do now is we have dhpreact

**[1:37:53]** and we'd like to produce dhprevn and we'd like to do that in a very

**[1:37:57]** efficient manner so that's the name of the game calculate

**[1:38:00]** dhprevn given dhpreact and for the purposes of this

**[1:38:05]** exercise we're going to ignore gamma and beta and their derivatives

**[1:38:09]** because they take on a very simple form in a very similar way to what we

**[1:38:12]** did up above so let's calculate this given that

**[1:38:17]** right here so to help you a little bit like i did before

**[1:38:21]** i started off the implementation here on pen and paper

**[1:38:25]** and i took two sheets of paper to derive the mathematical formulas for the

**[1:38:29]** backward pass and basically to set up the problem

**[1:38:32]** just write out the mu sigma square variance

**[1:38:36]** xi hat and yi exactly as in the paper except for the Bessel correction

**[1:38:41]** and then in the backward pass we have the derivative of the loss with respect to

**[1:38:45]** all the elements of y and remember that y is a vector there's

**[1:38:49]** there's multiple numbers here so we have all the derivatives of

**[1:38:54]** respect to all the y's and then if there's a

**[1:38:57]** gamma and a beta and this is kind of like the compute graph

**[1:39:01]** the gamma and the beta there's the x hat and then the mu and the sigma

**[1:39:05]** square and the x so we have d l by d yi and we won't

**[1:39:10]** d l by d xi for all the i's in these vectors

**[1:39:15]** so this is the compute graph and you have to be careful because

**[1:39:19]** i'm trying to note here that these are vectors there's many

**[1:39:23]** nodes here inside x x hat and y but mu and sigma sorry sigma square are just

**[1:39:29]** individual scalars single numbers so you have to be careful with that you

**[1:39:33]** have to imagine there's multiple nodes here or you're gonna get your math wrong

**[1:39:37]** so as an example i would suggest that you go in the following order

**[1:39:41]** one two three four in terms of the back propagation

**[1:39:45]** so back propagate into x hat then to sigma square then into mu

**[1:39:49]** and then into x just like an entopological sort in micrograd we

**[1:39:54]** would go from right to left you're doing the exact same thing except

**[1:39:57]** you're doing it with symbols and on a piece of paper

**[1:40:01]** so for number one i'm not giving away too much

**[1:40:05]** if you want d l of d xi hat then we just take d l by d yi and multiply by

**[1:40:13]** gamma because of this expression here where any individual

**[1:40:16]** yi is just gamma times xi hat plus beta so it didn't help you too much there

**[1:40:23]** but this gives you basically the derivatives for all the x hats

**[1:40:27]** and so now try to go through this computational graph

**[1:40:30]** and derive what is d l by d sigma square

**[1:40:35]** and then what is d l by d mu and then what is d l by d x

**[1:40:39]** eventually so give it a go and i'm going to be revealing the answer

**[1:40:43]** one piece at a time okay so to get d l by d sigma square

**[1:40:47]** we have to remember again like i mentioned that there are many x hats

**[1:40:51]** here and remember that sigma square is just

**[1:40:53]** a single individual number here so when we look at the

**[1:40:57]** expression for d l by d sigma square we have that we have to

**[1:41:02]** actually consider all the possible paths that

**[1:41:08]** we basically have that there's many x hats and they all feed off

**[1:41:12]** from they all depend on sigma square so sigma square has a large fan out

**[1:41:16]** there's lots of arrows coming out from sigma square into all the x hats

**[1:41:20]** and then there's a back propagating signal from each x hat

**[1:41:23]** into sigma square and that's why we actually need to sum over all those

**[1:41:27]** eyes from i equal to 1 to m of the d l by d xi hat

**[1:41:34]** which is the global gradient times the xi hat by d sigma square

**[1:41:40]** which is the local gradient of this operation here

**[1:41:44]** and then mathematically i'm just working it out here and i'm simplifying

**[1:41:47]** and you get a certain expression for d l by d sigma square

**[1:41:51]** and we're going to be using this expression when we back propagate into mu

**[1:41:54]** and then eventually into x so now let's continue our back propagation into mu

**[1:41:58]** so what is d l by d mu now again be careful that mu influences x hat

**[1:42:04]** and x hat is actually lots of values so for example if our mini batch size is

**[1:42:08]** 32 as it is in our example that we were working on

**[1:42:11]** then this is 32 numbers and 32 arrows going back to mu

**[1:42:15]** and then mu going to sigma square is just a single arrow because sigma

**[1:42:18]** square is a scalar so in total there are 33

**[1:42:21]** arrows emanating from mu and then all of them have gradients coming into

**[1:42:26]** mu and they all need to be summed up and so that's why

**[1:42:30]** when we look at the expression for d l by d mu i am summing up

**[1:42:34]** over all the gradients of d l by d xi hat times d xi hat by d mu

**[1:42:40]** so that's the that's this arrow and that's 32 arrows here

**[1:42:44]** and then plus the one arrow from here which is d l by d sigma square

**[1:42:48]** times d sigma square by d mu so now we have to work out that expression

**[1:42:52]** and let me just reveal the rest of it simplifying here is not complicated

**[1:42:58]** the first term and you just get an expression here for the second term

**[1:43:01]** though there's something really interesting that happens

**[1:43:04]** when we look at d sigma square by d mu and we simplify

**[1:43:08]** at one point if we assume that in a special case where mu is actually

**[1:43:13]** the average of xi's as it is in this case

**[1:43:17]** then if we plug that in then actually the gradient vanishes and becomes exactly

**[1:43:22]** zero and that makes the entire second term cancel

**[1:43:26]** and so these uh if you just have a mathematical expression like this and

**[1:43:30]** you look at d sigma square by d mu you would get some

**[1:43:33]** mathematical formula for how mu impacts sigma square

**[1:43:37]** but if it is the special case that mu is actually equal to the average

**[1:43:41]** as it is in the case of batch normalization that gradient will actually

**[1:43:44]** vanish and become zero so the whole term cancels

**[1:43:47]** and we just get a fairly straightforward expression here for d l by d

**[1:43:51]** mu okay and now we get to the craziest part which is

**[1:43:55]** deriving d l by d xi which is ultimately what we're after

**[1:43:59]** now let's count first of all how many numbers are there inside x as i mentioned

**[1:44:04]** there are 32 numbers there are 32 little xi's

**[1:44:07]** and let's count the number of arrows emanating from each xi

**[1:44:11]** there's an arrow going to mu an arrow going to sigma square

**[1:44:14]** and then there's an arrow going to x hat but this arrow here

**[1:44:18]** let's scrutinize that a little bit each xi hat is just a function of xi and all

**[1:44:24]** the other scalars so xi hat only depends on xi and

**[1:44:28]** none of the other x's and so therefore there are actually

**[1:44:32]** in this single arrow there are 32 arrows but those 32 arrows are going

**[1:44:36]** exactly parallel they don't interfere they're just going parallel

**[1:44:40]** between x and x hat you can look at it that way and so how many arrows are

**[1:44:43]** emanating from each xi there are three arrows mu

**[1:44:47]** sigma square and the associated x hat and so in back

**[1:44:51]** propagation we now need to apply the chain rule

**[1:44:54]** and we need to add up those three contributions so here's what that

**[1:44:58]** looks like if i just write that out we have uh we're going through

**[1:45:04]** we're chaining through mu sigma square and through x hat

**[1:45:07]** and those three terms are just here now we already have

**[1:45:12]** three of these we have dl by dx i hat we have dl by d mu which we derived here

**[1:45:18]** and we have dl by d sigma square which we derived here but we need three other

**[1:45:22]** terms here the this one this one and this one

**[1:45:26]** so i invite you to try to derive them it's not that complicated you're

**[1:45:29]** just looking at these expressions here and differentiating with respect to

**[1:45:32]** xi so give it a shot but here's the result

**[1:45:39]** or at least what i got um yeah i'm just i'm just differentiating with respect to

**[1:45:44]** xi for all of these expressions and honestly i don't think there's anything

**[1:45:47]** too tricky here it's basic calculus now what gets a little bit more tricky is

**[1:45:52]** we are now going to plug everything together so all of these terms multiplied

**[1:45:56]** with all of these terms and added up according to this formula and that

**[1:45:59]** gets a little bit hairy so what ends up happening is

**[1:46:04]** uh you get a large expression and the thing to be very careful with

**[1:46:09]** here of course is we are working with a dl by dx i for specific

**[1:46:13]** i here but when we are plugging in some of these terms

**[1:46:17]** like say this term here dl by d sigma squared you see how dl by d sigma

**[1:46:24]** squared i end up with an expression and i'm iterating over little i's here

**[1:46:28]** but i can't use i as the variable when i plug in here

**[1:46:32]** because this is a different i from this i this i here is just a placeholder

**[1:46:36]** like a local variable for for a for loop in here

**[1:46:40]** so here when i plug that in you notice that i rename the i to a j

**[1:46:43]** because i need to make sure that this j is not that this j is not this i

**[1:46:48]** this j is like like a little local iterator over 32 terms

**[1:46:52]** and so you have to be careful with that when you're plugging in the

**[1:46:54]** expressions from here to here you may have to rename i's into j's

**[1:46:57]** and you have to be very careful what is actually an i with respect to the

**[1:47:01]** dl by d xi so some of these are j's

**[1:47:06]** some of these are i's and then we simplify this expression

**[1:47:11]** and i guess like the big thing to notice here is

**[1:47:14]** a bunch of terms just kind of come out to the front and you can refactor them

**[1:47:17]** there's a sigma squared plus epsilon raised to the power of negative 3 over

**[1:47:20]** 2 this sigma squared plus epsilon can be

**[1:47:23]** actually separated out into three terms each of them are sigma

**[1:47:26]** squared plus epsilon to the negative 1 over 2

**[1:47:29]** so the three of them multiplied is equal to this

**[1:47:33]** and then those three terms can go different places because of the

**[1:47:36]** multiplication so one of them actually comes out to the front and will end up

**[1:47:40]** here outside one of them joins up with this term

**[1:47:44]** and one of them joins up with this other term and then when you simplify the

**[1:47:48]** expression you'll notice that some of these terms that are coming out

**[1:47:51]** are just the xi hats so you can simplify just by

**[1:47:55]** rewriting that and what we end up with at the end is a fairly simple mathematical

**[1:47:59]** expression over here that i cannot simplify further

**[1:48:02]** but basically you'll notice that it only uses the stuff we have

**[1:48:06]** and it derives the thing we need so we have dl by dy for all the

**[1:48:11]** i's and those are used plenty of times here

**[1:48:14]** and also in addition what we're using is these xi hats and xj hats

**[1:48:18]** and they just come from the forward pass

**[1:48:21]** and otherwise this is a simple expression and it gives us

**[1:48:24]** dl by dx i for all the i's and that's ultimately what we're interested in

**[1:48:29]** so that's the end of bashtorm backward pass

**[1:48:33]** analytically let's now implement this final result

**[1:48:36]** okay so i implemented the expression into a single line of code here

**[1:48:40]** and you can see that the max diff is tiny so this is the correct

**[1:48:43]** implementation of this formula now i'll just

**[1:48:48]** basically tell you that getting this formula here from this mathematical

**[1:48:52]** expression was not trivial and there's a lot going on packed into this one

**[1:48:56]** formula and this is a whole exercise by itself

**[1:48:59]** because you have to consider the fact that this formula here

**[1:49:02]** is just for a single neuron and a batch of 32 examples

**[1:49:06]** but what i'm doing here is i'm actually we actually have 64 neurons

**[1:49:09]** and so this expression has to in parallel evaluate the bashtorm

**[1:49:13]** backward pass for all of those 64 neurons in parallel and

**[1:49:16]** independently so this has to happen basically in every single

**[1:49:20]** column of the inputs here and in addition to that you see how there are a

**[1:49:26]** bunch of sums here and we need to make sure that when i do those sums

**[1:49:29]** that they broadcast correctly onto everything else that's here

**[1:49:33]** and so getting this expression is just like highly non trivial and i invite

**[1:49:36]** you to basically look through it and step through it and it's a whole

**[1:49:38]** exercise to make sure that this this checks out but once all the

**[1:49:44]** shapes agree and once you convince yourself that it's correct you can also

**[1:49:47]** verify that patchers gets the exact same answer as well

**[1:49:50]** and so that gives you a lot of peace of mind that this mathematical formula is

**[1:49:53]** correctly implemented here and broadcasted correctly

**[1:49:56]** and replicated in parallel for all of the 64 neurons

**[1:50:01]** inside this bashtorm layer okay and finally exercise number four

**[1:50:04]** asks you to put it all together and here we have a redefinition of the

**[1:50:09]** entire problem so you see that we re-initialize the neural

**[1:50:11]** net from scratch and everything and then here

**[1:50:14]** instead of calling loss that backward we want to have the manual back propagation

**[1:50:18]** here as we derived it up above so go up copy paste all the chunks

**[1:50:22]** of code that we've already derived put them here and derive your own

**[1:50:26]** gradients and then optimize this neural net

**[1:50:29]** basically using your own gradients all the way to

**[1:50:32]** the calibration of the bashtorm and the evaluation of the loss

**[1:50:35]** and i was able to achieve quite a good loss basically the same loss you

**[1:50:37]** would achieve before and that shouldn't be surprising

**[1:50:40]** because all we've done is we've really got into loss

**[1:50:43]** that backward and we've pulled out all the code and inserted it here

**[1:50:47]** but those gradients are identical and everything is identical and the

**[1:50:51]** results are identical it's just that we have full

**[1:50:53]** visibility on exactly what goes on under the hood of loss that

**[1:50:57]** backward in this specific case okay and this is

**[1:51:00]** all of our code this is the full backward pass using basically the

**[1:51:04]** simplified backward pass for the cross entropy loss

**[1:51:07]** and the bashtromalization so back propagating through cross entropy

**[1:51:11]** the second layer the 10-H nonlinearity the bashtromalization

**[1:51:17]** through the first layer and through the embedding and so you see that this is

**[1:51:20]** only maybe what is this 20 lines of code or something like that

**[1:51:24]** and that's what gives us gradients and now we can potentially erase

**[1:51:28]** loss as backward so the way i have the code set up is

**[1:51:31]** you should be able to run this entire cell once you fill this in

**[1:51:34]** and this will run for only a hundred iterations and then break

**[1:51:37]** and it breaks because it gives you an opportunity to check your gradients

**[1:51:41]** against pytorch so here our gradients we see are not exactly equal

**[1:51:47]** they are approximately equal and the differences are tiny

**[1:51:50]** 1-9 or so and i don't exactly know where they're coming from

**[1:51:54]** to be honest so once we have some confidence that the gradients are

**[1:51:57]** basically correct we can take out the gradient checking

**[1:52:01]** we can disable this breaking statement

**[1:52:05]** and then we can basically disable loss of backward

**[1:52:10]** we don't need it anymore feels amazing to say that

**[1:52:14]** and then here when we are doing the update we're not going to use p.grad

**[1:52:18]** this is the old way of pytorch we don't have that anymore because we're

**[1:52:22]** not doing it backward we are going to use this update

**[1:52:26]** where we you see that i'm iterating over

**[1:52:29]** i've arranged the grads to be in the same order as the parameters

**[1:52:32]** and i'm zipping them up the gradients and the parameters

**[1:52:35]** into p and grad and then here i'm going to step with just the grad

**[1:52:38]** that we derived manually so the last piece is that none of this now

**[1:52:45]** requires gradients from pytorch and so one thing you can do here

**[1:52:52]** is you can do with torched at no grad and offset this whole code block

**[1:52:58]** and really what you're saying is you're telling pytorch that hey i'm not going to

**[1:53:00]** call backward on any of this and this allows pytorch to be a bit

**[1:53:03]** more efficient with all of it and then we should be able to just

**[1:53:07]** run this and it's running and you see that

**[1:53:15]** loss of backward is commented out and we're optimizing

**[1:53:20]** so we're going to leave this run and hopefully we get a good result

**[1:53:25]** okay so i allowed the neural net to finish optimization

**[1:53:28]** then here i calibrate the bachelor parameters because i did not

**[1:53:32]** keep track of the running mean and variance in their training loop

**[1:53:37]** then here i ran the loss and you see that we actually obtained a pretty good

**[1:53:40]** loss very similar to what we've achieved before

**[1:53:44]** and then here i'm sampling from the model and we see some of the name

**[1:53:47]** like gibberish that we're sort of used to

**[1:53:49]** so basically the model worked and samples pretty decent results compared to

**[1:53:54]** what we're used to so everything is the same

**[1:53:56]** but of course the big deal is that we did not use lots of backward

**[1:54:00]** we did not use pytorch autograd and we estimated our gradients ourselves

**[1:54:03]** by hand and so hopefully you're looking at this

**[1:54:06]** the backward pass of this neural net and you're thinking to yourself

**[1:54:09]** actually that's not too complicated each one of these layers is like three

**[1:54:14]** lines of code or something like that and most of it is fairly

**[1:54:17]** straightforward potentially with the notable exception of the

**[1:54:20]** bachelor normalization backward pass otherwise it's pretty good

**[1:54:24]** okay and that's everything i wanted to cover for this lecture so

**[1:54:27]** hopefully you found this interesting and what i liked about it honestly is that

**[1:54:31]** it gave us a very nice diversity of layers to back propagate through

**[1:54:35]** and i think it gives a pretty nice and comprehensive sense of how these

**[1:54:39]** backward passes are implemented and how they work

**[1:54:42]** and you'd be able to derive them yourself but of course in practice

**[1:54:45]** you probably don't want to and you want to use the pytorch autograd

**[1:54:48]** but hopefully you have some intuition about how gradients flow

**[1:54:51]** backwards through the neural net starting at the loss and how they flow

**[1:54:54]** through all the variables and all the intermediate results

**[1:54:58]** and if you understood a good chunk of it and if you have a sense of that

**[1:55:01]** then you can count yourself as one of these buff doji's on the left

**[1:55:04]** instead of the doji's on the right here now in the next lecture we're

**[1:55:09]** actually going to go to recurrent neural nets lstms and

**[1:55:12]** all the other variants of arnes and we're going to start to

**[1:55:16]** complexify the architecture and start to achieve better log-like

**[1:55:19]** limits and so i'm really looking forward to that and i'll see you then

