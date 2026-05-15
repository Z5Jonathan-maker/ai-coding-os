---
source: "https://www.youtube.com/watch?v=TCH_1BHY58I"
kind: video
title: "Building makemore Part 2: MLP"
retrieved: "2026-05-04T05:12:09+00:00"
word_count: 14952
char_count: 97834
source_url: "https://www.youtube.com/watch?v=TCH_1BHY58I"
---

# Building makemore Part 2: MLP

# Building makemore Part 2: MLP

- **Source:** https://www.youtube.com/watch?v=TCH_1BHY58I
- **Uploader:** Andrej Karpathy
- **Duration:** 1:15:39

## Description

We implement a multilayer perceptron (MLP) character-level language model. In this video we also introduce many basics of machine learning (e.g. model training, learning rate tuning, hyperparameters, evaluation, train/dev/test splits, under/overfitting, etc.).

Links:
- makemore on github: https://github.com/karpathy/makemore
- jupyter notebook I built in this video: https://github.com/karpathy/nn-zero-to-hero/blob/master/lectures/makemore/makemore_part2_mlp.ipynb
- collab notebook (new)!!!: https://colab.research.google.com/drive/1YIfmkftLrz6MPTOO9Vwqrop2Q5llHIGK?usp=sharing
- Bengio et al. 2003 MLP language model paper (pdf): https://www.jmlr.org/papers/volume3/bengio03a/bengio03a.pdf
- my website: https://karpathy.ai
- my twitter: https://twitter.com/karpathy
- (new) Neural Networks: Zero to Hero series Discord channel: https://discord.gg/3zy8kqD9Cp , for people who'd like to chat more and go beyond youtube comments

Useful links:
- PyTorch internals ref http://blog.ezyang.com/2019/05/pytorch-internals/

Exercises:
- E01: Tune the hyperparameters of the training to beat my best validation loss of 2.2
- E02: I was not careful with the intialization of the network in this video. (1) What is the loss you'd get if the predicted probabilities at initialization were perfectly uniform? What loss do we achieve? (2) Can you tune the initialization to get a starting loss that is much more similar to (1)?
- E03: Read the Bengio et al 2003 paper (link above), implement and try any idea from the paper. Did it work?

Chapters:
00:00:00 intro
00:01:48 Bengio et al. 2003 (MLP language model) paper walkthrough
00:09:03 (re-)building our training dataset
00:12:19 implementing the embedding lookup table
00:18:35 implementing the hidden layer + internals of torch.Tensor: storage, views
00:29:15 implementing the output layer
00:29:53 implementing the negative log likelihood loss
00:32:17 summary of the full network
00:32:49 introducing F.cross_entropy and why
00:37:56 implementing the training loop, overfitting one batch
00:41:25 training on the full dataset, minibatches
00:45:40 finding a good initial learning rate
00:53:20 splitting up the dataset into train/val/test splits and why
01:00:49 experiment: larger hidden layer
01:05:27 visualizing the character embeddings
01:07:16 experiment: larger embedding size
01:11:46 summary of our final code, conclusion
01:13:24 sampling from the model
01:14:55 google collab (new!!) notebook advertisement

## Transcript

**[0:00:00]** Hi everyone, today we are continuing our implementation of Make More.

**[0:00:05]** Now in the last lecture, we implemented the bygram language model and we implemented it

**[0:00:09]** both using counts and also using a super simple neural network that had a single linear layer.

**[0:00:15]** Now this is the Jupyter Notebook that we built out last lecture and we saw that the

**[0:00:21]** way we approached this is that we looked at only the single previous character and

**[0:00:24]** we predicted the distribution for the character that would go next in the sequence and

**[0:00:29]** we did that by taking counts and normalizing them into probabilities so that each row here

**[0:00:35]** sums to one.

**[0:00:36]** Now this is all well and good if you only have one character of previous context and this

**[0:00:42]** works and it's approachable.

**[0:00:43]** The problem with this model of course is that the predictions from this model are not

**[0:00:48]** very good because you only take one character of context.

**[0:00:51]** So the model didn't produce very name like sounding things.

**[0:00:56]** Now the problem with this approach though is that if we are to take more context into

**[0:01:00]** account when predicting the next character in a sequence, things quickly blow up and

**[0:01:04]** this table, the size of this table, grows and in fact it grows exponentially with the

**[0:01:09]** length of the context.

**[0:01:11]** Because if we only take a single character at a time that's 27 possibilities of context

**[0:01:16]** but if we take two characters in the past and try to predict the third one, suddenly

**[0:01:20]** the number of rows in this matrix, you can look at it that way, is 27 times 27.

**[0:01:25]** So there's 729 possibilities for what could have come in the context.

**[0:01:30]** If we take three characters as the context, suddenly we have 20,000 possibilities of context.

**[0:01:37]** And so that's just way too many rows of this matrix.

**[0:01:41]** It's way too few counts for each possibility and the whole thing just kind of explodes

**[0:01:46]** and doesn't work very well.

**[0:01:49]** So that's why today we're going to move on to this bullet point here and we're

**[0:01:52]** going to implement a multi-layer perceptron model to predict the next character in a

**[0:01:57]** sequence and this modeling approach that we're going to adopt follows this paper

**[0:02:01]** Ben Duetel 2003.

**[0:02:04]** So I have the paper pulled up here.

**[0:02:06]** Now this isn't the very first paper that proposed the use of multi-layer

**[0:02:10]** perceptrons or neural networks to predict the next character or token in a

**[0:02:13]** sequence but it's definitely one that is was very influential around that time.

**[0:02:18]** It is very often cited to stand in for this idea and I think it's a very

**[0:02:21]** nice write-up and so this is the paper that we're going to first look at and

**[0:02:25]** then implement.

**[0:02:26]** Now this paper has 19 pages so we don't have time to go into the full detail of

**[0:02:31]** this paper but I invite you to read it.

**[0:02:33]** It's very readable, interesting and has a lot of interesting ideas in it as well.

**[0:02:37]** In the introduction they described the exact same problem I just described

**[0:02:40]** and then to address it they proposed the following model.

**[0:02:44]** Now keep in mind that we are building a character level language model.

**[0:02:47]** So we're working on the level of characters.

**[0:02:50]** In this paper they have a vocabulary of 17,000 possible words and they instead

**[0:02:54]** build a word level language model but we're going to still stick with the

**[0:02:58]** characters but we'll take the same modeling approach.

**[0:03:01]** Now what they do is basically they propose to take every one of these

**[0:03:04]** words, 17,000 words, and they're going to associate to each word a

**[0:03:09]** say 30 dimensional feature vector.

**[0:03:12]** So every word is now embedded into a 30 dimensional space.

**[0:03:17]** You can think of it that way.

**[0:03:19]** So we have 17,000 points or vectors in a 30 dimensional space and that's you

**[0:03:25]** might imagine that's very crowded that's a lot of points for a very small space.

**[0:03:29]** Now in the beginning these words are initialized completely randomly so

**[0:03:32]** they're spread out at random but then we're going to tune these embeddings

**[0:03:37]** of these words using that propagation.

**[0:03:39]** So during the course of training of this neural network these points or

**[0:03:42]** vectors are going to basically move around in this space and you might

**[0:03:46]** imagine that for example words that have very similar meanings or there are

**[0:03:50]** indeed synonyms of each other might end up in a very similar part of the space

**[0:03:54]** and conversely words that mean very different things would go somewhere else

**[0:03:57]** in the space.

**[0:03:59]** Now their modeling approach otherwise is identical to ours.

**[0:04:02]** They are using a multilayer neural network to predict the next word given

**[0:04:06]** the previous words and to train the neural network they are maximizing

**[0:04:09]** the likelihood of the training data just like we did.

**[0:04:12]** So the modeling approach itself is identical.

**[0:04:15]** Now here they have a concrete example of this intuition.

**[0:04:18]** Why does it work?

**[0:04:20]** Basically suppose that for example you are trying to predict a dog was running

**[0:04:23]** in a blank.

**[0:04:25]** Now suppose that the exact phrase a dog was running in a has never occurred in

**[0:04:30]** a training data and here you are at sort of test time later when the model

**[0:04:34]** is deployed somewhere and it's trying to make a sentence and it's saying

**[0:04:39]** dog was running in a blank and because it's never encountered this exact

**[0:04:43]** phrase in the training set you're out of distribution as we say.

**[0:04:47]** Like you don't have fundamentally any reason to suspect what might come next.

**[0:04:54]** But this approach actually allows you to get around that because maybe you

**[0:04:57]** didn't see the exact phrase a dog was running in a something but maybe

**[0:05:01]** you've seen similar phrases.

**[0:05:02]** Maybe you've seen the phrase the dog was running in a blank and maybe

**[0:05:06]** your network has learned that a and the are like frequently are

**[0:05:10]** interchangeable with each other.

**[0:05:11]** And so maybe it took the embedding for a and the embedding for the and it

**[0:05:15]** actually put them like nearby each other in the space and so you can transfer

**[0:05:19]** knowledge through that embedding and you can generalize in that way.

**[0:05:23]** Similarly the network could know that cats and dogs are animals and

**[0:05:26]** they co-occur in lots of very similar contexts and so even though you

**[0:05:30]** haven't seen this exact phrase or if you haven't seen exactly walking

**[0:05:34]** or running you can through the embedding space transfer knowledge

**[0:05:38]** and you can generalize to novel scenarios.

**[0:05:42]** So let's not scroll down to the diagram of the neural network.

**[0:05:45]** They have a nice diagram here and in this example we are taking three

**[0:05:49]** previous words and we are trying to predict the fourth word in a sequence.

**[0:05:56]** Now these three previous words as I mentioned we have a vocabulary of

**[0:05:59]** 17,000 possible words.

**[0:06:03]** So every one of these basically are the index of the incoming word and

**[0:06:09]** because there are 17,000 words this is an integer between 0 and 16,999.

**[0:06:17]** Now there's also a lookup table that they call C.

**[0:06:21]** This lookup table is a matrix that is 17,000 by say 30.

**[0:06:26]** And basically what we're doing here is we're treating this as a lookup table.

**[0:06:29]** And so every index is plucking out a row of this embedding matrix so

**[0:06:35]** that each index is converted to the 30 dimensional vector that

**[0:06:39]** corresponds to the embedding vector for that word.

**[0:06:43]** So here we have the input layer of 30 neurons for

**[0:06:46]** three words making up 90 neurons in total.

**[0:06:50]** And here they're saying that this matrix C is shared across all the words.

**[0:06:54]** So we're always indexing into the same matrix C over and

**[0:06:57]** over for each one of these words.

**[0:07:02]** Next up is the hidden layer of this neural network.

**[0:07:04]** The size of this hidden neural layer of this neural net is a HOP parameter.

**[0:07:09]** So we use the word hyperparameter when it's kind of like a design choice

**[0:07:12]** up to the designer of the neural net.

**[0:07:13]** And this can be as large as you'd like or as small as you'd like.

**[0:07:16]** So for example, the size could be 100.

**[0:07:19]** And we are going to go over multiple choices of the size of this hidden

**[0:07:22]** layer and we're going to evaluate how well they work.

**[0:07:26]** So say there were 100 neurons here, all of them would be fully connected

**[0:07:29]** to the 90 words or 90 numbers that make up these three words.

**[0:07:35]** So this is a fully connected layer.

**[0:07:37]** Then there's a 10-inch long linearity and then there's this output layer.

**[0:07:41]** And because our 17,000 possible words that could come next,

**[0:07:45]** this layer has 17,000 neurons and all of them are fully connected

**[0:07:50]** to all of these neurons in the hidden layer.

**[0:07:54]** So there's a lot of parameters here because there's a lot of words.

**[0:07:57]** So most computation is here.

**[0:07:59]** This is the expensive layer.

**[0:08:01]** Now there are 17,000 logits here.

**[0:08:04]** So on top of there, we have the softmax layer,

**[0:08:06]** which we've seen in our previous video as well.

**[0:08:09]** So every one of these logits is exponentiated

**[0:08:11]** and then everything is normalized to some to one

**[0:08:14]** so that we have a nice probability distribution

**[0:08:16]** for the next word in the sequence.

**[0:08:19]** Now of course during training, we actually have the label.

**[0:08:22]** We have the identity of the next word in the sequence.

**[0:08:25]** That word or its index is used to pluck out the probability of that word

**[0:08:32]** and then we are maximizing the probability of that word

**[0:08:36]** with respect to the parameters of this neural net.

**[0:08:39]** So the parameters are the weights and biases of this output layer,

**[0:08:44]** the weights and biases of the hidden layer,

**[0:08:46]** and the embedding lookup table C.

**[0:08:49]** And all of that is optimized using back propagation.

**[0:08:52]** And these dashed arrows ignore those.

**[0:08:55]** That represents a variation of a neural net

**[0:08:57]** that we are not going to explore in this video.

**[0:08:59]** So that's the setup and now let's implement it.

**[0:09:02]** Okay, so I started a brand new notebook for this lecture.

**[0:09:05]** We are importing PyTorch

**[0:09:07]** and we are importing Matplotlib so we can create figures.

**[0:09:10]** Then I am reading all the names into a list of words

**[0:09:13]** like I did before and I'm showing the first eight right here.

**[0:09:18]** Keep in mind that we have a 32,000 in total.

**[0:09:21]** These are just the first eight.

**[0:09:22]** And then here I'm building out the vocabulary of characters

**[0:09:25]** and all the mappings from the characters as strings to integers and vice versa.

**[0:09:31]** Now the first thing we want to do

**[0:09:32]** is we want to compile the dataset for the neural network.

**[0:09:35]** And I had to rewrite this code.

**[0:09:37]** I'll show you in a second what it looks like.

**[0:09:41]** So this is the code that I created for the dataset creation.

**[0:09:43]** So let me first run it and then I'll briefly explain how this works.

**[0:09:47]** So first we're going to define something called block size.

**[0:09:51]** And this is basically the context length

**[0:09:53]** of how many characters do we take to predict the next one.

**[0:09:56]** So here in this example we're taking three characters

**[0:09:59]** to predict the fourth one.

**[0:10:00]** So we have a block size of three.

**[0:10:02]** That's the size of the block that supports the prediction.

**[0:10:06]** Then here I'm building out the x and y.

**[0:10:09]** The x are the input to the neural net

**[0:10:12]** and the y are the labels for each example inside x.

**[0:10:17]** Then I'm already over the first five words.

**[0:10:19]** I'm doing first five just for efficiency

**[0:10:21]** while we are developing all the code.

**[0:10:23]** But then later we're going to come here and erase this

**[0:10:26]** so that we use the entire training set.

**[0:10:29]** So here I'm printing the word Emma.

**[0:10:31]** And here I'm basically showing the examples that we can generate,

**[0:10:35]** the five examples that we can generate

**[0:10:37]** out of the single sort of word Emma.

**[0:10:41]** So when we are given the context of just dot dot dot,

**[0:10:45]** the first character in a sequence is e.

**[0:10:47]** In this context the label is m.

**[0:10:50]** When the context is this the label is m and so forth.

**[0:10:54]** And so the way I build this out is first

**[0:10:55]** I start with a padded context of just zero tokens.

**[0:10:59]** Then I iterate over all the characters.

**[0:11:01]** I get the character in the sequence

**[0:11:04]** and I basically build out the array y

**[0:11:06]** of this current character and the array x

**[0:11:09]** which stores the current running context.

**[0:11:11]** And then here see I print everything

**[0:11:13]** and here I crop the context

**[0:11:16]** and enter the new character in a sequence.

**[0:11:18]** So this is kind of like a role in the window of context.

**[0:11:22]** Now we can change the block size here to for example four

**[0:11:25]** and in that case we would be predicting

**[0:11:27]** the fifth character given the previous four.

**[0:11:30]** Or it can be five and then it would look like this.

**[0:11:33]** Or it can be say 10.

**[0:11:36]** And then it would look something like this.

**[0:11:37]** We're taking 10 characters to predict the 11th one

**[0:11:40]** and we're always padding with dots.

**[0:11:43]** So let me bring this back to three

**[0:11:45]** just so that we have what we have here in the paper.

**[0:11:49]** And finally the dataset right now looks as follows.

**[0:11:53]** From these five words we have created a dataset of 32 examples

**[0:11:57]** and each input to the neural net is three integers.

**[0:12:01]** And we have a label that is also an integer y.

**[0:12:04]** So x looks like this.

**[0:12:06]** These are the individual examples.

**[0:12:08]** And then y are the labels.

**[0:12:12]** So given this let's now write a neural network

**[0:12:16]** that takes these x's and predicts the y's.

**[0:12:19]** First let's build the embedding lookup table C.

**[0:12:23]** So we have 27 possible characters

**[0:12:25]** and we're going to embed them in a lower dimensional space.

**[0:12:28]** In the paper they have 17,000 words

**[0:12:31]** and they embed them in spaces as small dimensional as 30.

**[0:12:35]** So they cram 17,000 words into 30 dimensional space.

**[0:12:40]** In our case we have only 27 possible characters.

**[0:12:43]** So let's cram them in something as small as to start with

**[0:12:46]** for example a two dimensional space.

**[0:12:48]** So this lookup table will be random numbers

**[0:12:51]** and we'll have 27 rows and we'll have two columns.

**[0:12:56]** Right so each one of 27 characters

**[0:12:59]** will have a two dimensional embedding.

**[0:13:02]** So that's our matrix C of embeddings

**[0:13:05]** in the beginning initialized randomly.

**[0:13:07]** Now before we embed all of the integers inside the input x

**[0:13:11]** using this lookup table C

**[0:13:14]** let me actually just try to embed a single individual integer

**[0:13:17]** like say 5.

**[0:13:19]** So we get a sense of how this works.

**[0:13:21]** Now one way this works of course

**[0:13:23]** is we can just take the C

**[0:13:25]** and we can index into row 5

**[0:13:27]** and that gives us a vector the fifth row of C

**[0:13:31]** and this is one way to do it.

**[0:13:34]** The other way that I presented in the previous lecture

**[0:13:37]** is actually seemingly different but actually identical.

**[0:13:40]** So in the previous lecture what we did

**[0:13:42]** is we took these integers

**[0:13:43]** and we used the one-hot encoding

**[0:13:45]** to first encode them.

**[0:13:46]** So if that one-hot we want to encode integer 5

**[0:13:50]** and we want to tell it that the number of classes is 27.

**[0:13:53]** So that's the 26 dimensional vector of all zeros

**[0:13:56]** except the fifth bit is turned on.

**[0:13:59]** Now this actually doesn't work.

**[0:14:03]** The reason is that this input

**[0:14:05]** actually must be a torch dot tensor

**[0:14:07]** and I'm making some of these errors intentionally

**[0:14:09]** just so you get to see some errors

**[0:14:11]** and how to fix them.

**[0:14:12]** So this must be a tensor not an int

**[0:14:14]** fairly straightforward to fix.

**[0:14:16]** We get a one-hot vector.

**[0:14:18]** The fifth dimension is 1

**[0:14:19]** and the shape of this is 27.

**[0:14:22]** And now notice that

**[0:14:23]** just as I briefly alluded to in a previous video

**[0:14:26]** if we take this one-hot vector

**[0:14:28]** and we multiply it by C

**[0:14:33]** then what would you expect?

**[0:14:37]** Well, number one,

**[0:14:39]** first you'd expect an error

**[0:14:41]** because expected scalar type long but found float.

**[0:14:46]** So a little bit confusing

**[0:14:47]** but the problem here is that one-hot

**[0:14:49]** the data type of it is long.

**[0:14:53]** It's a 64 bit integer

**[0:14:55]** but this is a float tensor

**[0:14:57]** and so PyTorch doesn't know how to multiply

**[0:14:59]** an int with a float

**[0:15:01]** and that's why we had to explicitly cast this to a float

**[0:15:04]** so that we can multiply.

**[0:15:06]** Now the output actually here is identical

**[0:15:11]** and that it's identical

**[0:15:12]** because of the way the matrix multiplication here works.

**[0:15:15]** We have the one-hot vector multiplying columns of C

**[0:15:19]** and because of all the zeros

**[0:15:21]** they actually end up masking out everything in C

**[0:15:23]** except for the fifth row which is plucked out.

**[0:15:27]** And so we actually arrive at the same result

**[0:15:29]** and that tells you that

**[0:15:31]** here we can interpret this first piece here

**[0:15:34]** this embedding of the integer.

**[0:15:35]** We can either think of it as the integer indexing

**[0:15:38]** into a lookup table C

**[0:15:39]** but equivalently we can also think of this little piece here

**[0:15:42]** as a first layer of this bigger neural net.

**[0:15:46]** This layer here has neurons that have no non-linearity

**[0:15:49]** there's no 10-H

**[0:15:50]** they're just linear neurons

**[0:15:52]** and their weight matrix is C

**[0:15:55]** and then we are encoding integers into one-hot

**[0:15:58]** and feeding those into a neural net

**[0:15:59]** and this first layer basically embeds them.

**[0:16:02]** So those are two equivalent ways of doing the same thing

**[0:16:05]** we're just going to index because it's much much faster

**[0:16:08]** and we're going to discard this interpretation of one-hot inputs

**[0:16:12]** into neural nets

**[0:16:13]** and we're just going to index integers

**[0:16:15]** and create and use embedding tables.

**[0:16:17]** Now embedding a single integer like five is easy enough

**[0:16:20]** we can simply ask by torch to retrieve the fifth row of C

**[0:16:24]** or the row index five of C

**[0:16:27]** but how do we simultaneously embed

**[0:16:29]** all of these 32 by 3 integers stored in array X?

**[0:16:34]** Luckily by torch indexing is fairly flexible and quite powerful

**[0:16:38]** so it doesn't just work to ask for a single element five like this

**[0:16:44]** you can actually index using lists

**[0:16:46]** so for example we can get the rows five six and seven

**[0:16:49]** and this will just work like this

**[0:16:51]** we can index with a list

**[0:16:53]** it doesn't just have to be a list

**[0:16:54]** it can also be a actually a tensor of integers

**[0:16:58]** and we can index with that

**[0:17:00]** so this is a integer tensor five six seven

**[0:17:03]** and this will just work as well

**[0:17:05]** in fact we can also for example repeat row seven

**[0:17:09]** and retrieve it multiple times

**[0:17:10]** and that same index will just get embedded multiple times here

**[0:17:16]** so here we are indexing with a one-dimensional

**[0:17:18]** tensor of integers

**[0:17:20]** but it turns out that you can also index

**[0:17:22]** with multi-dimensional tensors of integers

**[0:17:25]** here we have a two-dimensional tensor of integers

**[0:17:28]** so we can simply just do C at X

**[0:17:32]** and this just works

**[0:17:34]** and the shape of this is 32 by 3

**[0:17:38]** which is the original shape

**[0:17:40]** and now for every one of those 32 by 3 integers

**[0:17:42]** we've retrieved the embedding vector here

**[0:17:45]** so basically we have that as an example

**[0:17:49]** the 13th or example index 13

**[0:17:54]** the second dimension is the integer 1 as an example

**[0:17:58]** and so here if we do C of X

**[0:18:01]** which gives us that array

**[0:18:03]** and then we index into 13 by 2 of that array

**[0:18:07]** then we get the embedding here

**[0:18:10]** and you can verify that C at 1

**[0:18:14]** which is the integer at that location

**[0:18:16]** is indeed equal to this

**[0:18:19]** you see they're equal

**[0:18:21]** so basically long story short

**[0:18:23]** PyTorch indexing is awesome

**[0:18:25]** and to embed simultaneously

**[0:18:28]** all of the integers in X

**[0:18:29]** we can simply do C of X

**[0:18:31]** and that is our embedding

**[0:18:33]** and that just works

**[0:18:35]** now let's construct this layer here

**[0:18:37]** the hidden layer

**[0:18:38]** so we have that W1 as I'll call it

**[0:18:42]** are these weights

**[0:18:43]** which we will initialize randomly

**[0:18:45]** now the number of inputs to this layer

**[0:18:48]** is going to be 3 times 2

**[0:18:50]** right because we have two dimensional embeddings

**[0:18:52]** and we have three of them

**[0:18:53]** so the number of inputs is 6

**[0:18:56]** and the number of neurons in this layer

**[0:18:58]** is a variable up to us

**[0:19:00]** let's use 100 neurons as an example

**[0:19:02]** and then biases will be also initialized randomly

**[0:19:06]** as an example

**[0:19:07]** and let's

**[0:19:08]** and we just need 100 of them

**[0:19:11]** now the problem with this is

**[0:19:13]** we can't simply

**[0:19:14]** normally we would take the input

**[0:19:15]** in this case that's embedding

**[0:19:17]** and we'd like to multiply it

**[0:19:18]** with these weights

**[0:19:20]** and then we would like to add the bias

**[0:19:22]** this is roughly what we want to do

**[0:19:24]** but the problem here is that

**[0:19:25]** these embeddings are stacked up

**[0:19:27]** in the dimensions of this input tensor

**[0:19:29]** so this will not work

**[0:19:30]** this matrix multiplication

**[0:19:32]** because this is a shape 32 by 3 by 2

**[0:19:34]** and I can't multiply that by 6 by 100

**[0:19:37]** so somehow we need to concatenate

**[0:19:39]** these inputs here together

**[0:19:41]** so that we can do something along these lines

**[0:19:42]** which currently does not work

**[0:19:45]** so how do we transform this

**[0:19:46]** 32 by 3 by 2

**[0:19:47]** into a 32 by 6

**[0:19:49]** so that we can actually perform

**[0:19:51]** this multiplication over here

**[0:19:54]** I'd like to show you that there are usually

**[0:19:55]** many ways of implementing

**[0:19:58]** what you'd like to do in Torch

**[0:20:00]** and some of them will be faster

**[0:20:01]** better shorter etc

**[0:20:03]** and that's because Torch is

**[0:20:05]** a very large library

**[0:20:06]** and it's got lots and lots of functions

**[0:20:08]** so if we just go to the documentation

**[0:20:09]** and click on Torch

**[0:20:11]** you'll see that

**[0:20:12]** my slider here is very tiny

**[0:20:14]** and that's because there are so many

**[0:20:15]** functions that you can call on these tensors

**[0:20:17]** to transform them

**[0:20:18]** create them

**[0:20:19]** multiply them

**[0:20:20]** add them

**[0:20:21]** perform all kinds of different operations on them

**[0:20:24]** and so this is kind of like

**[0:20:28]** the space of possibility

**[0:20:29]** if you will

**[0:20:31]** now one of the things that you can do

**[0:20:32]** is if we can control here

**[0:20:33]** control f for concatenate

**[0:20:35]** and we see that there's a function

**[0:20:37]** torch.cat

**[0:20:38]** short for concatenate

**[0:20:40]** and this concatenates a given sequence

**[0:20:41]** of tensors

**[0:20:42]** in a given dimension

**[0:20:44]** and these tensors must have the same shape

**[0:20:47]** etc

**[0:20:47]** so we can use the concatenate operation

**[0:20:49]** to in a naive way

**[0:20:51]** concatenate these three embeddings

**[0:20:53]** for each input

**[0:20:55]** so in this case we have

**[0:20:57]** m of

**[0:20:58]** m of the shape

**[0:21:00]** and really what we want to do is

**[0:21:01]** we want to retrieve these three parts

**[0:21:03]** and concatenate them

**[0:21:04]** so we want to grab all the examples

**[0:21:08]** we want to grab

**[0:21:10]** first the 0th

**[0:21:12]** index

**[0:21:14]** and then

**[0:21:15]** all of

**[0:21:16]** this

**[0:21:17]** so this

**[0:21:18]** plugs out

**[0:21:20]** the 32 by 2

**[0:21:22]** embeddings

**[0:21:22]** of just the first

**[0:21:24]** word here

**[0:21:26]** and so basically we want this guy

**[0:21:28]** we want the first dimension

**[0:21:30]** and we want the second dimension

**[0:21:32]** and these are the three

**[0:21:34]** pieces individually

**[0:21:36]** and then we want to treat this as a sequence

**[0:21:38]** and we want to torch.cat

**[0:21:40]** on that sequence

**[0:21:41]** so this is the list

**[0:21:43]** torch.cat takes a

**[0:21:45]** sequence

**[0:21:46]** of tensors

**[0:21:47]** and then we have to tell it along

**[0:21:48]** which dimension to concatenate

**[0:21:51]** so in this case

**[0:21:52]** all of these are 32 by 2

**[0:21:53]** and we want to concatenate

**[0:21:54]** not across dimension 0

**[0:21:55]** but across dimension 1

**[0:21:58]** so passing in 1

**[0:21:59]** gives us a result

**[0:22:01]** that the shape of this is 32 by 6

**[0:22:03]** exactly as we'd like

**[0:22:05]** so that basically took 32

**[0:22:07]** and squashed these by concatenating them

**[0:22:09]** into 32 by 6

**[0:22:11]** now this is kind of ugly

**[0:22:12]** because this code would not generalize

**[0:22:15]** if we want to later change the block size

**[0:22:17]** right now we have three inputs

**[0:22:19]** three words

**[0:22:20]** but what if we had five

**[0:22:22]** then here we would have to change the code

**[0:22:23]** because i'm indexing directly

**[0:22:25]** well torch comes to rescue again

**[0:22:27]** because there turns out to be

**[0:22:29]** a function called unbind

**[0:22:31]** and it removes a tensor dimension

**[0:22:35]** so removes a tensor dimension

**[0:22:36]** returns a tuple of all slices

**[0:22:38]** along a given dimension

**[0:22:40]** without it

**[0:22:41]** so this is exactly what we need

**[0:22:43]** and basically when we call torch dot unbind

**[0:22:47]** torch dot unbind

**[0:22:50]** of m

**[0:22:51]** and passing dimension

**[0:22:54]** 1 index 1

**[0:22:56]** this gives us a list of

**[0:22:59]** a list of tensors

**[0:23:00]** exactly equivalent to this

**[0:23:02]** so running this

**[0:23:04]** gives us a line

**[0:23:06]** 3

**[0:23:07]** and it's exactly this list

**[0:23:09]** and so we can call torch dot cat on it

**[0:23:12]** and along the first dimension

**[0:23:14]** and this works

**[0:23:16]** and this shape is the same

**[0:23:19]** but now this is uh

**[0:23:20]** it doesn't matter if we have

**[0:23:21]** block size 3 or 5 or 10

**[0:23:23]** this will just work

**[0:23:24]** so this is one way to do it

**[0:23:26]** but it turns out that in this case

**[0:23:28]** there's actually a significantly better

**[0:23:30]** and more efficient way

**[0:23:31]** and this gives me an opportunity

**[0:23:32]** to hint at some of the

**[0:23:34]** internals of torch dot tensor

**[0:23:36]** so let's create an array here

**[0:23:39]** of elements from 0 to 17

**[0:23:42]** and the shape of this

**[0:23:44]** is just 18

**[0:23:45]** it's a single vector of 18 numbers

**[0:23:47]** it turns out that we can

**[0:23:49]** very quickly re-represent this

**[0:23:51]** as different sized

**[0:23:52]** and dimensional tensors

**[0:23:54]** we do this by calling a view

**[0:23:57]** and we can say that

**[0:23:58]** actually this is not a single vector of 18

**[0:24:01]** this is a 2 by 9 tensor

**[0:24:04]** or alternatively this is a 9 by 2 tensor

**[0:24:06]** or this is actually a 3 by 3 by 2 tensor

**[0:24:11]** as long as the total number of elements here

**[0:24:14]** multiply to be the same

**[0:24:16]** this will just work

**[0:24:18]** and in PyTorch

**[0:24:19]** this operation calling that view

**[0:24:22]** is extremely efficient

**[0:24:23]** and the reason for that

**[0:24:25]** is that in each tensor

**[0:24:26]** there's something called

**[0:24:27]** the underlying storage

**[0:24:30]** and the storage is just

**[0:24:31]** the numbers always

**[0:24:33]** as a one dimensional vector

**[0:24:34]** and this is how

**[0:24:35]** this tensor has represented

**[0:24:37]** in the computer memory

**[0:24:38]** it's always a one dimensional vector

**[0:24:41]** but when we call that view

**[0:24:43]** we are manipulating some of

**[0:24:45]** attributes of that tensor

**[0:24:47]** that dictate

**[0:24:48]** how this one dimensional sequence

**[0:24:50]** is interpreted to be

**[0:24:51]** an n dimensional tensor

**[0:24:53]** and so what's happening here

**[0:24:54]** is that no memory

**[0:24:55]** is being changed, copied,

**[0:24:56]** moved or created

**[0:24:57]** when we call that view

**[0:24:59]** the storage is identical

**[0:25:01]** but when you call that view

**[0:25:03]** some of the internal

**[0:25:05]** attributes of the view of this tensor

**[0:25:07]** are being manipulated and changed

**[0:25:09]** in particular that something

**[0:25:10]** there's something called

**[0:25:11]** a storage offset

**[0:25:12]** strides and shapes

**[0:25:13]** and those are manipulated

**[0:25:14]** so that this one dimensional sequence

**[0:25:16]** of bytes

**[0:25:17]** is seen as different

**[0:25:18]** n dimensional arrays

**[0:25:20]** there's a blog post here

**[0:25:21]** from Eric

**[0:25:22]** called PyTorch Internals

**[0:25:24]** where he goes into some of this

**[0:25:26]** with respect to tensor

**[0:25:27]** and how the view of a tensor

**[0:25:28]** is represented

**[0:25:30]** and this is really just

**[0:25:30]** like a logical construct

**[0:25:33]** of representing the physical memory

**[0:25:35]** and so this is a pretty good

**[0:25:37]** blog post that you can go into

**[0:25:39]** I might also create an entire video

**[0:25:41]** on the internals of torch tensor

**[0:25:42]** and how this works

**[0:25:44]** for here

**[0:25:45]** we just note that this is an

**[0:25:46]** extremely efficient operation

**[0:25:48]** and if I delete this

**[0:25:49]** and come back to our m

**[0:25:53]** we see that the shape of our m

**[0:25:54]** is 32 by 3 by 2

**[0:25:56]** but we can simply

**[0:25:58]** ask for PyTorch to view this

**[0:25:59]** instead as a 32 by 6

**[0:26:03]** and the way that gets flattened

**[0:26:05]** into a 32 by 6 array

**[0:26:07]** just happens that

**[0:26:09]** these two

**[0:26:10]** get stacked up

**[0:26:12]** in a single row

**[0:26:13]** and so that's basically the

**[0:26:14]** concatenation operation that we're after

**[0:26:17]** and you can verify that

**[0:26:18]** this actually gives the exact

**[0:26:19]** same result as what we had before

**[0:26:22]** so this is an element y equals

**[0:26:23]** and you can see that all the

**[0:26:24]** elements of these two tensors

**[0:26:25]** are the same

**[0:26:27]** and so we get the exact same result

**[0:26:30]** so long story short

**[0:26:31]** we can actually just come here

**[0:26:34]** and if we just view this

**[0:26:35]** as a 32 by 6

**[0:26:38]** instead

**[0:26:39]** then this multiplication will work

**[0:26:41]** and give us the hidden states

**[0:26:43]** that we're after

**[0:26:44]** so if this is h

**[0:26:45]** then h dash shape

**[0:26:47]** is now the hundred dimensional

**[0:26:49]** activations

**[0:26:50]** for every one of our 32 examples

**[0:26:53]** and this gives the desired result

**[0:26:55]** let me do two things here

**[0:26:56]** number one

**[0:26:57]** let's not use 32

**[0:26:58]** we can for example do something like

**[0:27:02]** amp dot shape at zero

**[0:27:05]** so that we don't hard code

**[0:27:06]** these numbers

**[0:27:07]** and this would work for any

**[0:27:08]** size of this amp

**[0:27:10]** or alternatively we can also do negative one

**[0:27:12]** when we do negative one

**[0:27:13]** pi torch will infer what this should be

**[0:27:16]** because the number of elements

**[0:27:17]** must be the same

**[0:27:18]** and we're saying that this is 6

**[0:27:20]** pi torch will derive that this

**[0:27:21]** must be 32

**[0:27:22]** or whatever else it is

**[0:27:23]** if amp is of different size

**[0:27:26]** the other thing is here

**[0:27:29]** one more thing I'd like to point out is

**[0:27:32]** here when we do the concatenation

**[0:27:35]** this actually is much less efficient

**[0:27:37]** because this concatenation

**[0:27:39]** would create a whole new tensor

**[0:27:40]** with a whole new storage

**[0:27:42]** so new memories being created

**[0:27:43]** because there's no way to concatenate

**[0:27:45]** tensors just by manipulating

**[0:27:46]** the view attributes

**[0:27:48]** so this is inefficient

**[0:27:49]** and creates all kinds of new memory

**[0:27:52]** so let me delete this now

**[0:27:55]** we don't need this

**[0:27:57]** and here to calculate h

**[0:27:58]** we want to also dot 10h

**[0:28:01]** of this

**[0:28:02]** to get our

**[0:28:04]** to get our h

**[0:28:07]** so these are now numbers

**[0:28:07]** between negative one and one

**[0:28:09]** because of the 10h

**[0:28:10]** and we have

**[0:28:11]** that the shape is 32 by 100

**[0:28:13]** and that is basically

**[0:28:14]** this hidden layer of activations here

**[0:28:17]** for every one of our 32 examples

**[0:28:20]** now there's one more thing I've lost over

**[0:28:21]** that we have to be very careful with

**[0:28:23]** and that this

**[0:28:24]** and that's this plus here

**[0:28:26]** in particular we want to make sure

**[0:28:27]** that the broadcasting

**[0:28:28]** will do what we like

**[0:28:30]** the shape of this is 32 by 100

**[0:28:33]** and the one's shape is 100

**[0:28:35]** so we see that the addition here

**[0:28:37]** will broadcast these two

**[0:28:38]** and in particular we have

**[0:28:40]** 32 by 100

**[0:28:41]** broadcasting to 100

**[0:28:44]** so broadcasting will align on the right

**[0:28:47]** create a fake dimension here

**[0:28:49]** so this will become a 1 by 100 row vector

**[0:28:51]** and then it will copy vertically

**[0:28:54]** for every one of these rows of 32

**[0:28:56]** and do an element-wise addition

**[0:28:58]** so in this case the correct thing

**[0:29:00]** will be happening

**[0:29:01]** because the same bias vector

**[0:29:03]** will be added to all the rows

**[0:29:05]** of this matrix

**[0:29:07]** so that is correct

**[0:29:08]** that's what we'd like

**[0:29:09]** and it's always good practice

**[0:29:11]** to just make sure

**[0:29:12]** so that you don't treat yourself in the foot

**[0:29:14]** and finally let's create the final layer here

**[0:29:17]** so let's create

**[0:29:19]** W2 and B2

**[0:29:22]** the input now is 100

**[0:29:24]** and the output number of neurons

**[0:29:26]** will be for us 27

**[0:29:28]** because we have 27 possible characters

**[0:29:30]** that come next

**[0:29:31]** so the biases will be 27 as well

**[0:29:34]** so therefore the logits

**[0:29:36]** which are the outputs of this neural net

**[0:29:38]** are going to be

**[0:29:41]** H multiplied by W2

**[0:29:44]** plus B2

**[0:29:47]** logits that shape

**[0:29:48]** is 32 by 27

**[0:29:50]** and the logits look good

**[0:29:52]** now exactly as we saw in the previous video

**[0:29:54]** we want to take these logits

**[0:29:56]** and we want to first

**[0:29:57]** exponentiate them

**[0:29:58]** to get our fake counts

**[0:30:00]** and then we want to normalize them

**[0:30:01]** into a probability

**[0:30:02]** so probe is counts divide

**[0:30:05]** and now counts that sum

**[0:30:09]** along the first dimension

**[0:30:10]** and keep them as true

**[0:30:11]** exactly as in the previous video

**[0:30:14]** and so probe that shape now

**[0:30:17]** is 32 by 27

**[0:30:20]** and you'll see that every row of probe

**[0:30:23]** sums to one

**[0:30:24]** so it's normalized

**[0:30:26]** so that gives us the probabilities

**[0:30:28]** now of course we have the actual letter

**[0:30:30]** that comes next

**[0:30:31]** and that comes from this array Y

**[0:30:34]** which we created during the dataset creation

**[0:30:37]** so Y is this last piece here

**[0:30:39]** which is the identity of the next character

**[0:30:41]** in the sequence that we'd like to now predict

**[0:30:44]** so what we'd like to do now

**[0:30:46]** is just as in the previous video

**[0:30:47]** we'd like to index into the rows of probe

**[0:30:50]** and in each row

**[0:30:51]** we'd like to pluck out the probability assigned

**[0:30:53]** to the correct character

**[0:30:55]** as given here

**[0:30:56]** so first we have torch.arrange of 32

**[0:31:00]** which is kind of like a iterator

**[0:31:02]** over numbers from 0 to 31

**[0:31:05]** and then we can index into probe

**[0:31:07]** in the following way

**[0:31:09]** probe in torch.arrange of 32

**[0:31:12]** which iterates the rows

**[0:31:13]** and then in each row

**[0:31:14]** we'd like to grab this column

**[0:31:17]** as given by Y

**[0:31:19]** so this gives the current probabilities

**[0:31:21]** as assigned by this neural network

**[0:31:22]** with this setting of its weights

**[0:31:24]** to the correct character in the sequence

**[0:31:27]** and you can see here that

**[0:31:29]** this looks okay for some of these characters

**[0:31:30]** like this is basically 0.2

**[0:31:33]** but it doesn't look very good at all

**[0:31:34]** for many other characters

**[0:31:35]** like this is 0.0701 probability

**[0:31:39]** and so the network thinks that

**[0:31:41]** some of these are extremely unlikely

**[0:31:42]** but of course we haven't trained

**[0:31:43]** the neural network yet

**[0:31:45]** so this will improve

**[0:31:48]** and ideally all of these numbers here

**[0:31:49]** of course are 1

**[0:31:50]** because then we are correctly predicting

**[0:31:52]** the next character

**[0:31:53]** now just as in the previous video

**[0:31:55]** we want to take these probabilities

**[0:31:57]** we want to look at the log probability

**[0:31:59]** and then we want to look at the average log probability

**[0:32:02]** and the negative of it

**[0:32:03]** to create the negative log likelihood loss

**[0:32:07]** so the loss here is 17

**[0:32:10]** and this is the loss that we'd like to minimize

**[0:32:12]** to get the network to predict

**[0:32:14]** the correct character in the sequence

**[0:32:16]** okay so I rewrote everything here

**[0:32:18]** and made it a bit more respectable

**[0:32:20]** so here's our dataset

**[0:32:21]** here's all the parameters that we defined

**[0:32:24]** I'm now using a generator to make it reproducible

**[0:32:27]** I clustered all the parameters

**[0:32:29]** into a single list of parameters

**[0:32:30]** so that for example it's easy to count them

**[0:32:33]** and see that in total we currently

**[0:32:34]** have about 3400 parameters

**[0:32:37]** and this is the forward pass as we developed it

**[0:32:39]** and we arrive at a single number here

**[0:32:41]** the loss that is currently expressing

**[0:32:44]** how well this neural network works

**[0:32:46]** with the current setting of parameters

**[0:32:48]** now I would like to make it even more respectable

**[0:32:51]** so in particular see these lines here

**[0:32:53]** where we take the logits

**[0:32:54]** and we calculate the loss

**[0:32:57]** we're not actually reinventing the wheel here

**[0:32:59]** this is just classification

**[0:33:02]** and many people use classification

**[0:33:04]** and that's why there is a functional

**[0:33:06]** dot cross entropy function in PyTorch

**[0:33:08]** to calculate this much more efficiently

**[0:33:10]** so we could just simply call f dot cross entropy

**[0:33:13]** and we can pass in the logits

**[0:33:14]** and we can pass in the array of targets y

**[0:33:18]** and this calculates the exact same loss

**[0:33:21]** so in fact we can simply put this here

**[0:33:25]** and erase these three lines

**[0:33:27]** and we're going to get the exact same result

**[0:33:29]** now there are actually many good reasons

**[0:33:31]** to prefer f dot cross entropy

**[0:33:33]** over rolling your own implementation like this

**[0:33:35]** I did this for educational reasons

**[0:33:37]** but you'd never use this in practice

**[0:33:39]** why is that?

**[0:33:40]** number one when you use f dot cross entropy

**[0:33:42]** PyTorch will not actually create

**[0:33:44]** all these intermediate tensors

**[0:33:46]** because these are all new tensors in memory

**[0:33:48]** and all this is fairly inefficient to run like this

**[0:33:52]** instead PyTorch will cluster up all these operations

**[0:33:55]** and very often create fused kernels

**[0:33:58]** that very efficiently evaluate these expressions

**[0:34:00]** that are sort of like clustered mathematical operations

**[0:34:04]** number two the backward pass can be made

**[0:34:06]** much more efficient

**[0:34:07]** and not just because it's a fused kernel

**[0:34:09]** but also analytically and mathematically

**[0:34:12]** it's often a very much simpler

**[0:34:15]** backward pass to implement

**[0:34:17]** we actually sell this with micrograd

**[0:34:19]** you see here when we implemented 10h

**[0:34:21]** the forward pass of this operation

**[0:34:23]** to calculate the 10h

**[0:34:25]** was actually a fairly complicated mathematical expression

**[0:34:28]** but because it's a clustered mathematical expression

**[0:34:30]** when we did the backward pass

**[0:34:32]** we didn't individually backward through the x

**[0:34:34]** and the 2 times and the minus 1 and division etc

**[0:34:37]** we just said it's 1 minus t squared

**[0:34:40]** and that's a much simpler mathematical expression

**[0:34:43]** and we were able to do this

**[0:34:44]** because we're able to reuse calculations

**[0:34:46]** and because we are able to mathematically

**[0:34:48]** and analytically derive the derivative

**[0:34:50]** and often that expression simplifies mathematically

**[0:34:53]** and so there's much less to implement

**[0:34:56]** so not only can it be made more efficient

**[0:34:58]** because it runs in a fused kernel

**[0:35:00]** but also because the expressions

**[0:35:01]** can take a much simpler form mathematically

**[0:35:05]** so that's number one

**[0:35:07]** number two under the hood

**[0:35:09]** f dot cross entropy can also be significantly more

**[0:35:13]** numerically well behaved

**[0:35:15]** let me show you an example of how this works

**[0:35:19]** suppose we have a logits of negative two three

**[0:35:21]** negative three zero and five

**[0:35:23]** and then we are taking the exponent of it

**[0:35:25]** and normalizing it to sum to one

**[0:35:27]** so when logits take on this values

**[0:35:30]** everything is well and good

**[0:35:31]** and we get a nice probability distribution

**[0:35:33]** now consider what happens

**[0:35:34]** when some of these logits take on more extreme values

**[0:35:37]** and that can happen during optimization of a neural network

**[0:35:40]** suppose that some of these numbers grow

**[0:35:42]** very negative like say negative 100

**[0:35:45]** then actually everything will come out fine

**[0:35:47]** we still get a probabilities that

**[0:35:50]** you know are well behaved

**[0:35:51]** and they sum to one and everything is great

**[0:35:54]** but because of the way the x works

**[0:35:56]** if you have very positive logits

**[0:35:58]** let's say positive 100 in here

**[0:36:00]** you actually start to run into trouble

**[0:36:02]** and we get not a number here

**[0:36:04]** and the reason for that is that these counts

**[0:36:08]** have an nth here

**[0:36:10]** so if you pass in a very negative number two x

**[0:36:13]** you just get a very negative

**[0:36:15]** sorry not negative but very small number

**[0:36:17]** very near zero and that's fine

**[0:36:19]** but if you pass in a very positive number

**[0:36:21]** suddenly we run out of range

**[0:36:23]** in our floating point number

**[0:36:25]** that represents these counts

**[0:36:28]** so basically we're taking e

**[0:36:29]** and we're raising it to the power of 100

**[0:36:31]** and that gives us nth

**[0:36:33]** because we run out of dynamic range

**[0:36:34]** on this floating point number that is count

**[0:36:37]** and so we cannot pass very large logits

**[0:36:41]** through this expression

**[0:36:43]** now let me reset these numbers

**[0:36:45]** to something reasonable

**[0:36:47]** the way PyTorch solve this is that

**[0:36:50]** you see how we have a well behaved result here

**[0:36:53]** it turns out that because of the normalization here

**[0:36:55]** you can actually offset logits

**[0:36:58]** by any arbitrary constant value that you want

**[0:37:00]** so if I add one here

**[0:37:02]** you actually get the exact same result

**[0:37:04]** or if I add two

**[0:37:06]** or if I subtract three

**[0:37:08]** any offset will produce the exact same probabilities

**[0:37:11]** so because negative numbers are okay

**[0:37:14]** but positive numbers can actually overflow this exp

**[0:37:18]** what PyTorch does is it internally calculates

**[0:37:20]** the maximum value that occurs in the logits

**[0:37:23]** and it subtracts it

**[0:37:24]** so in this case it would subtract five

**[0:37:26]** and so therefore the greatest number in logits

**[0:37:29]** will become zero

**[0:37:30]** and all the other numbers will become some negative numbers

**[0:37:33]** and then the result of this is always well behaved

**[0:37:36]** so even if we have 100 here previously

**[0:37:39]** not good

**[0:37:40]** but because PyTorch will subtract 100

**[0:37:42]** this will work

**[0:37:44]** and so there's many good reasons to call cross entropy

**[0:37:48]** number one the forward pass can be much more efficient

**[0:37:50]** the backward pass can be much more efficient

**[0:37:53]** and also things can be much more numerically well behaved

**[0:37:56]** okay so let's now set up the training of this neural net

**[0:37:59]** we have the forward pass

**[0:38:02]** we don't need these

**[0:38:04]** is that we have the loss is equal to

**[0:38:06]** look at that cross entropy

**[0:38:08]** that's the forward pass

**[0:38:09]** then we need the backward pass

**[0:38:11]** first we want to set the gradients to be zero

**[0:38:14]** so for p in parameters

**[0:38:16]** we want to make sure that p dot grad is none

**[0:38:18]** which is the same as setting it to zero in PyTorch

**[0:38:20]** and then loss that backward to populate those gradients

**[0:38:24]** once we have the gradients we can do the parameter update

**[0:38:27]** so for p in parameters we want to take all the data

**[0:38:30]** and we want to nudge it

**[0:38:32]** learning rate times p dot grad

**[0:38:36]** and then we want to repeat this a few times

**[0:38:41]** now and let's print the loss here as well

**[0:38:48]** now this won't suffice and it will create an error

**[0:38:50]** because we also have to go for p in parameters

**[0:38:53]** and we have to make sure that p dot requires grad

**[0:38:56]** is set to true in PyTorch

**[0:38:59]** and this should just work

**[0:39:03]** okay so we started off with loss of 17

**[0:39:05]** and we're decreasing it

**[0:39:08]** let's run longer

**[0:39:10]** and you see how the loss decreases

**[0:39:12]** a lot here so

**[0:39:17]** if we just run four thousand times

**[0:39:19]** we get a very very low loss

**[0:39:21]** and that means that we're making very good predictions

**[0:39:23]** now the reason that this is so straightforward right now

**[0:39:27]** is because we're only

**[0:39:29]** overfitting 32 examples

**[0:39:32]** so we only have 32 examples of the first five words

**[0:39:36]** and therefore it's very easy to make this neural net fit

**[0:39:39]** only these two 32 examples

**[0:39:41]** because we have 3400 parameters

**[0:39:44]** and only 32 examples

**[0:39:46]** so we're doing what's called overfitting a single batch of the data

**[0:39:50]** and getting a very low loss and good predictions

**[0:39:54]** but that's just because we have so many parameters for so few examples

**[0:39:56]** so it's easy to make this be very low

**[0:40:00]** now we're not able to achieve exactly zero

**[0:40:02]** and the reason for that is

**[0:40:04]** we can for example look at logits

**[0:40:05]** which are being predicted

**[0:40:08]** and we can look at the max along the first dimension

**[0:40:12]** and in PyTorch

**[0:40:15]** max reports both the actual values

**[0:40:17]** that take on the maximum number

**[0:40:19]** but also the indices of these

**[0:40:22]** and you'll see that the indices are very close to the labels

**[0:40:26]** but in some cases they differ

**[0:40:28]** for example in this very first example

**[0:40:31]** the predicted index is 19

**[0:40:32]** but the label is 5

**[0:40:35]** and we're not able to make loss be zero

**[0:40:37]** and fundamentally that's because here

**[0:40:39]** the very first or the 0th index

**[0:40:41]** is the example where dot dot dot is supposed to predict E

**[0:40:44]** but you see how dot dot dot is also supposed to predict an O

**[0:40:47]** and dot dot dot is also supposed to predict an I

**[0:40:50]** and then S as well

**[0:40:51]** and so basically E, O, A or S

**[0:40:55]** are all possible outcomes in a training set

**[0:40:57]** for the exact same input

**[0:40:59]** so we're not able to completely overfit

**[0:41:01]** and make the loss be exactly zero

**[0:41:04]** but we're getting very close

**[0:41:07]** in the cases where there's a unique input

**[0:41:10]** for a unique output

**[0:41:12]** in those cases we do what's called overfit

**[0:41:14]** and we basically get the exact same

**[0:41:16]** and the exact correct result

**[0:41:18]** so now all we have to do

**[0:41:21]** is we just need to make sure

**[0:41:22]** that we read in the full dataset

**[0:41:23]** and optimize the neural line

**[0:41:25]** okay so let's swing back up

**[0:41:27]** where we created the dataset

**[0:41:29]** and we see that here we only use the first five words

**[0:41:31]** so let me now erase this

**[0:41:33]** and let me erase the print statements

**[0:41:35]** otherwise we'd be printing way too much

**[0:41:37]** and so when we process the full dataset of all the words

**[0:41:41]** we now had 228,000 examples

**[0:41:43]** instead of just 32

**[0:41:45]** so let's now scroll back down

**[0:41:47]** the dataset is much larger

**[0:41:49]** we initialize the weights

**[0:41:50]** the same number of parameters

**[0:41:52]** they all require gradients

**[0:41:54]** and then let's push this printout loss.item

**[0:41:57]** to be here

**[0:41:58]** and let's just see how the optimization goes

**[0:42:00]** if we run this

**[0:42:04]** okay so we started with a fairly high loss

**[0:42:06]** and then as we're optimizing

**[0:42:07]** the loss is coming down

**[0:42:11]** but you'll notice that it takes

**[0:42:13]** quite a bit of time

**[0:42:14]** for every single iteration

**[0:42:15]** so let's actually address that

**[0:42:17]** because we're doing way too much work

**[0:42:19]** forwarding and backwarding 220,000 examples

**[0:42:22]** in practice what people usually do

**[0:42:24]** is they perform forward

**[0:42:26]** and backward pass an update

**[0:42:27]** on many batches of the data

**[0:42:29]** so what we will want to do

**[0:42:31]** is we want to randomly select

**[0:42:32]** some portion of the dataset

**[0:42:34]** and that's a mini batch

**[0:42:35]** and then only forward, backward, and update

**[0:42:37]** on that little mini batch

**[0:42:38]** and then we iterate on those many batches

**[0:42:42]** so in PyTorch we can for example

**[0:42:43]** use torst.randint

**[0:42:45]** and we can generate numbers

**[0:42:46]** between 0 and 5

**[0:42:47]** and make 32 of them

**[0:42:52]** I believe the size has to be a

**[0:42:54]** tuple

**[0:42:56]** in PyTorch

**[0:42:57]** so we can have a tuple

**[0:42:59]** 32 of numbers between 0 and 5

**[0:43:01]** but actually we want

**[0:43:02]** x.shape of 0 here

**[0:43:05]** and so this creates integers

**[0:43:07]** that index into our dataset

**[0:43:09]** and there's 32 of them

**[0:43:10]** so if our mini batch size is 32

**[0:43:13]** then we can come here

**[0:43:14]** and we can first do

**[0:43:16]** mini batch construct

**[0:43:20]** so integers that we want to optimize

**[0:43:22]** in this single iteration

**[0:43:25]** are in the ix

**[0:43:27]** and then we want to index

**[0:43:28]** into x with ix

**[0:43:32]** to only grab those rows

**[0:43:34]** so we're only getting 32 rows of x

**[0:43:36]** and therefore embeddings

**[0:43:37]** will again be 32 by 3 by 2

**[0:43:40]** not 200 000 by 3 by 2

**[0:43:43]** and then this ix has to be used

**[0:43:44]** not just to index into x

**[0:43:46]** but also to index into y

**[0:43:50]** and now this should be mini batches

**[0:43:52]** and this should be much much faster

**[0:43:54]** so okay so it's instant almost

**[0:43:57]** so this way we can run many many

**[0:44:00]** examples

**[0:44:01]** nearly instantly

**[0:44:02]** and decrease the loss much much faster

**[0:44:05]** now because we're only doing with

**[0:44:06]** mini batches

**[0:44:07]** the quality of our gradient

**[0:44:09]** is lower

**[0:44:10]** so the direction is not as reliable

**[0:44:12]** it's not the actual gradient direction

**[0:44:14]** but the gradient direction is good enough

**[0:44:16]** even when it's estimating on only 32

**[0:44:19]** examples

**[0:44:20]** that it is useful

**[0:44:21]** and so it's much better

**[0:44:23]** to have an approximate gradient

**[0:44:25]** and just make more steps

**[0:44:26]** than it is to evaluate the exact

**[0:44:28]** gradient

**[0:44:28]** and take fewer steps

**[0:44:30]** so that's why in practice

**[0:44:32]** this works quite well

**[0:44:34]** so let's now continue the optimization

**[0:44:36]** let me take out this

**[0:44:39]** loss.item from here

**[0:44:41]** and place it over here at the end

**[0:44:45]** okay so we're hovering around 2.5 or so

**[0:44:50]** however this is only the loss for that

**[0:44:51]** mini batch

**[0:44:52]** so let's actually evaluate the loss

**[0:44:54]** here for all of x

**[0:44:58]** and for all of y

**[0:44:59]** just so we have a full sense of

**[0:45:01]** exactly how well the model is doing

**[0:45:03]** right now

**[0:45:04]** so right now we're about 2.7 on the

**[0:45:07]** entire training set

**[0:45:09]** so let's run the optimization for a while

**[0:45:12]** okay right 2.6

**[0:45:15]** 2.57

**[0:45:17]** 2.53

**[0:45:22]** so one issue of course is

**[0:45:24]** we don't know if we're stepping

**[0:45:25]** too slow or too fast

**[0:45:28]** so at this point one I just guessed it

**[0:45:30]** so one question is

**[0:45:32]** how do you determine this learning rate

**[0:45:34]** and how do we gain confidence that

**[0:45:37]** we're stepping in the right sort of speed

**[0:45:40]** so I'll show you one way to determine

**[0:45:41]** a reasonable learning rate

**[0:45:43]** it works as follows

**[0:45:44]** let's reset our parameters

**[0:45:47]** to the initial settings

**[0:45:51]** and now let's print in every step

**[0:45:54]** but let's only do 10 steps or so

**[0:45:58]** or maybe maybe 100 steps

**[0:46:00]** we want to find like a very reasonable

**[0:46:02]** set the search range if you will

**[0:46:05]** so for example if this is like very low

**[0:46:07]** then we see that the loss is barely decreasing

**[0:46:11]** so that's not that's like too low basically

**[0:46:15]** so let's try this one

**[0:46:18]** okay so we're decreasing the loss

**[0:46:19]** but like not very quickly

**[0:46:21]** so that's a pretty good low range

**[0:46:23]** now let's reset it again

**[0:46:25]** and now let's try to find the place

**[0:46:27]** at which the loss kind of explodes

**[0:46:29]** so maybe at negative one

**[0:46:33]** okay we see that we're minimizing the loss

**[0:46:35]** but you see how it's kind of unstable

**[0:46:37]** it goes up and down quite a bit

**[0:46:39]** so negative one is probably like a fast

**[0:46:42]** learning rate

**[0:46:43]** let's try negative 10

**[0:46:45]** okay so this isn't optimizing

**[0:46:48]** this is not working very well

**[0:46:49]** so negative 10 is way too big

**[0:46:50]** negative one was already kind of big

**[0:46:54]** so therefore negative one was like

**[0:46:57]** somewhat reasonable if I reset

**[0:47:00]** so I'm thinking that the right learning rate

**[0:47:01]** is somewhere between negative 0.001

**[0:47:05]** and negative one

**[0:47:08]** so the way we can do this here

**[0:47:09]** is we can use torque shot lens space

**[0:47:13]** and we want to basically do something like this

**[0:47:14]** between zero and one

**[0:47:16]** but

**[0:47:19]** number of steps is one more parameter

**[0:47:21]** that's required

**[0:47:22]** let's do a thousand steps

**[0:47:23]** this creates 1000 numbers

**[0:47:26]** between 0.001 and 1

**[0:47:29]** but it doesn't really make sense

**[0:47:30]** to step between these linearly

**[0:47:32]** so instead let me create

**[0:47:34]** learning rate exponent

**[0:47:36]** and instead of 0.001

**[0:47:38]** this will be a negative 3

**[0:47:40]** and this will be a 0

**[0:47:41]** and then the actual

**[0:47:42]** error loss that we want to search over

**[0:47:44]** are going to be 10 to the power of LRE

**[0:47:48]** so now what we're doing is

**[0:47:49]** we're stepping linearly

**[0:47:50]** between the exponents of these learning rates

**[0:47:52]** this is 0.001

**[0:47:54]** and this is 1

**[0:47:55]** because 10 to the power of 0 is 1

**[0:47:58]** and therefore we are spaced

**[0:48:00]** exponentially in this interval

**[0:48:02]** so these are the candidate

**[0:48:03]** learning rates

**[0:48:04]** that we want to sort of like

**[0:48:05]** search over roughly

**[0:48:07]** so now what we're going to do is

**[0:48:10]** here

**[0:48:11]** we are going to run the optimization

**[0:48:12]** for 1000 steps

**[0:48:14]** and instead of using a fixed number

**[0:48:16]** we are going to use

**[0:48:17]** learning rate

**[0:48:19]** indexing into here

**[0:48:20]** lr of i

**[0:48:22]** and make this i

**[0:48:25]** so basically let me

**[0:48:26]** be set this to be

**[0:48:28]** again starting from random

**[0:48:30]** creating these learning rates

**[0:48:31]** between 0.001 and 1

**[0:48:37]** but exponentially stepped

**[0:48:39]** and here what we're doing is

**[0:48:41]** we're iterating a thousand times

**[0:48:43]** we're going to use the learning rate

**[0:48:46]** that's in the beginning very very low

**[0:48:48]** in the beginning is going to be 0.001

**[0:48:50]** but by the end it's going to be 1

**[0:48:53]** and then we're going to step

**[0:48:54]** with that learning rate

**[0:48:57]** and now what we want to do

**[0:48:58]** is we want to keep track of the

**[0:49:01]** learning rates that we used

**[0:49:05]** and we want to look at the losses

**[0:49:08]** that resulted

**[0:49:09]** and so here let me

**[0:49:12]** track stats

**[0:49:14]** so lr of i that append lr

**[0:49:16]** and

**[0:49:18]** loss i that append

**[0:49:20]** loss that item

**[0:49:22]** okay

**[0:49:23]** so again reset everything

**[0:49:27]** and then run

**[0:49:30]** and so basically we started with a

**[0:49:31]** very low learning rate

**[0:49:32]** and we went all the way up to

**[0:49:34]** learning rate of negative one

**[0:49:35]** and now what we can do is

**[0:49:36]** we can pay all to that plot

**[0:49:39]** and we can plot the two

**[0:49:40]** so we can plot the learning rates

**[0:49:42]** on the x-axis

**[0:49:43]** and the losses we saw on the y-axis

**[0:49:46]** and often you're going to find

**[0:49:47]** that your plot looks something like

**[0:49:49]** this

**[0:49:50]** where in the beginning

**[0:49:51]** you had very low learning rates

**[0:49:53]** we basically anything

**[0:49:54]** barely anything happened

**[0:49:57]** then we got to like a nice spot

**[0:49:59]** here

**[0:50:00]** and then as we increased the

**[0:50:01]** learning rate enough

**[0:50:03]** we basically started to be

**[0:50:04]** kind of unstable here

**[0:50:05]** so a good learning rate

**[0:50:06]** turns out to be somewhere around

**[0:50:08]** here

**[0:50:10]** and because we have lri here

**[0:50:14]** we actually may want to

**[0:50:19]** do not lr

**[0:50:21]** not the learning rate

**[0:50:21]** but the exponent

**[0:50:22]** so that would be the

**[0:50:23]** lre at i

**[0:50:25]** is maybe what we want to log

**[0:50:26]** so let me reset this

**[0:50:27]** and redo that calculation

**[0:50:30]** but now on the x-axis

**[0:50:31]** we have the

**[0:50:34]** exponent of the learning rate

**[0:50:35]** and so we can see that the

**[0:50:36]** exponent of the learning rate

**[0:50:37]** that is good to use

**[0:50:38]** it would be sort of like

**[0:50:39]** roughly in the valley here

**[0:50:41]** because here the learning rates

**[0:50:42]** are just way too low

**[0:50:43]** and then here where

**[0:50:44]** we expect relatively good

**[0:50:45]** learning rates somewhere here

**[0:50:47]** and then here things are

**[0:50:47]** starting to explode

**[0:50:49]** so somewhere around

**[0:50:50]** negative one

**[0:50:51]** as the exponent of the learning rate

**[0:50:52]** is a pretty good setting

**[0:50:54]** and 10 to the negative one

**[0:50:56]** is 0.1

**[0:50:57]** so 0.1 is actually

**[0:50:58]** 0.1 was actually a

**[0:50:59]** fairly good learning rate

**[0:51:01]** around here

**[0:51:02]** and that's what we had

**[0:51:03]** in the initial setting

**[0:51:05]** but that's roughly

**[0:51:06]** how you would determine it

**[0:51:07]** and so here now

**[0:51:08]** we can take out

**[0:51:09]** the tracking of these

**[0:51:12]** and we can just

**[0:51:13]** simply set lr to be

**[0:51:15]** 10 to the negative one

**[0:51:17]** or basically otherwise 0.1

**[0:51:19]** as it was before

**[0:51:20]** and now we have some

**[0:51:21]** confidence that this is

**[0:51:22]** actually a fairly good

**[0:51:23]** learning rate

**[0:51:24]** and so now what we can do

**[0:51:25]** is we can crank up

**[0:51:26]** the iterations

**[0:51:27]** we can reset our optimization

**[0:51:30]** and we can run

**[0:51:32]** for a pretty long time

**[0:51:34]** using this learning rate

**[0:51:36]** oops

**[0:51:37]** and we don't want to print

**[0:51:38]** it's way too much printing

**[0:51:40]** so let me again reset

**[0:51:42]** and run 10,000 steps

**[0:51:48]** okay so we're 0.2

**[0:51:50]** 2.48 roughly

**[0:51:51]** let's run another 10,000 steps

**[0:51:53]** 2.46

**[0:52:00]** and now let's do

**[0:52:01]** one learning rate decay

**[0:52:02]** what this means is

**[0:52:03]** we're going to take

**[0:52:03]** our learning rate

**[0:52:04]** and we're going to

**[0:52:05]** 10x lower it

**[0:52:06]** and sort of where

**[0:52:07]** the late stages

**[0:52:08]** of training potentially

**[0:52:09]** and we may want to go

**[0:52:11]** a bit slower

**[0:52:12]** let's do one more

**[0:52:12]** actually at 0.1

**[0:52:14]** just to see if

**[0:52:16]** we're making a dent here

**[0:52:18]** okay we're still making dent

**[0:52:20]** and by the way

**[0:52:20]** the

**[0:52:21]** bygram loss

**[0:52:22]** that we achieved

**[0:52:23]** last video was 2.45

**[0:52:25]** so we've already surpassed

**[0:52:27]** the bygram model

**[0:52:29]** and once I get a sense

**[0:52:30]** that this is actually

**[0:52:30]** kind of starting to

**[0:52:31]** plateau off

**[0:52:32]** people like to do

**[0:52:33]** as I mentioned

**[0:52:33]** this learning rate decay

**[0:52:35]** so let's try to

**[0:52:36]** decay the loss

**[0:52:37]** the learning rate I mean

**[0:52:42]** and we achieve it

**[0:52:43]** about 2.3 now

**[0:52:46]** obviously this is janky

**[0:52:47]** and not exactly

**[0:52:48]** how you would

**[0:52:48]** train it in production

**[0:52:49]** but this is roughly

**[0:52:50]** what you're going through

**[0:52:51]** you first find

**[0:52:52]** a decent learning rate

**[0:52:53]** using the approach

**[0:52:54]** that I showed you

**[0:52:55]** then you start

**[0:52:56]** with that learning rate

**[0:52:57]** and you train for a while

**[0:52:58]** and then at the end

**[0:52:59]** people like to do

**[0:53:00]** a learning rate decay

**[0:53:01]** where you decay

**[0:53:02]** the learning rate

**[0:53:02]** by say a factor of 10

**[0:53:03]** and you do a few more steps

**[0:53:05]** and then you get

**[0:53:06]** a trained network

**[0:53:07]** roughly speaking

**[0:53:08]** so we've achieved

**[0:53:09]** 2.3 and dramatically

**[0:53:11]** improved on the

**[0:53:12]** bi-gram language model

**[0:53:13]** using this

**[0:53:14]** simple neural net

**[0:53:15]** as described here

**[0:53:17]** using these

**[0:53:17]** 3400 parameters

**[0:53:20]** now there's something

**[0:53:20]** we have to be careful with

**[0:53:22]** I said that

**[0:53:23]** we have a better model

**[0:53:24]** because we are achieving

**[0:53:25]** a lower loss

**[0:53:26]** 2.3 much lower

**[0:53:27]** than 2.45

**[0:53:28]** with the bi-gram model

**[0:53:29]** previously

**[0:53:30]** now that's not

**[0:53:31]** exactly true

**[0:53:32]** and the reason

**[0:53:32]** that's not true

**[0:53:33]** is that

**[0:53:37]** this is actually

**[0:53:37]** fairly small model

**[0:53:39]** but these models

**[0:53:39]** can get larger

**[0:53:40]** and larger

**[0:53:41]** if you keep adding

**[0:53:41]** neurons and parameters

**[0:53:43]** so you can imagine that

**[0:53:44]** we don't potentially

**[0:53:45]** have a thousand parameters

**[0:53:46]** we could have 10,000

**[0:53:47]** or 100,000

**[0:53:48]** or millions of parameters

**[0:53:49]** and as the capacity

**[0:53:50]** of the neural network grows

**[0:53:52]** it becomes more

**[0:53:53]** and more capable

**[0:53:54]** of overfitting

**[0:53:55]** your training set

**[0:53:56]** what that means

**[0:53:57]** is that the loss

**[0:53:58]** on the training set

**[0:54:00]** on the data

**[0:54:00]** that you're training on

**[0:54:01]** will become very

**[0:54:02]** very low

**[0:54:03]** as low as zero

**[0:54:04]** but all that the model

**[0:54:05]** is doing

**[0:54:06]** is memorizing

**[0:54:06]** your training set

**[0:54:07]** verbatim

**[0:54:08]** so if you take that model

**[0:54:10]** and it looks

**[0:54:10]** like it's working really well

**[0:54:11]** but you try to sample

**[0:54:12]** from it

**[0:54:13]** you will basically

**[0:54:14]** only get examples

**[0:54:15]** exactly as they are

**[0:54:16]** in the training set

**[0:54:17]** you won't get any new data

**[0:54:19]** in addition to that

**[0:54:19]** if you try to evaluate

**[0:54:20]** the loss

**[0:54:21]** on some withheld

**[0:54:22]** names

**[0:54:23]** or other words

**[0:54:24]** you will actually

**[0:54:25]** see that the loss

**[0:54:26]** on those

**[0:54:27]** can be very high

**[0:54:28]** as basically

**[0:54:29]** it's not a good model

**[0:54:30]** so the standard

**[0:54:31]** in the field

**[0:54:31]** it is to split up

**[0:54:33]** your data set

**[0:54:33]** into three splits

**[0:54:35]** as we call them

**[0:54:36]** we have the training split

**[0:54:37]** the dev split

**[0:54:38]** or the validation split

**[0:54:40]** and the test split

**[0:54:42]** so

**[0:54:43]** training split

**[0:54:45]** test

**[0:54:46]** or

**[0:54:46]** sorry

**[0:54:47]** dev or

**[0:54:48]** validation split

**[0:54:49]** and

**[0:54:50]** test split

**[0:54:51]** and typically

**[0:54:52]** this will be

**[0:54:53]** say 80 percent

**[0:54:54]** of your data set

**[0:54:54]** this could be 10 percent

**[0:54:55]** and this 10 percent

**[0:54:56]** roughly

**[0:54:58]** so you have these

**[0:54:58]** three splits

**[0:54:59]** of the data

**[0:55:01]** now these 80 percent

**[0:55:02]** of your trainings

**[0:55:03]** of the data set

**[0:55:04]** the training set

**[0:55:05]** is used to optimize

**[0:55:06]** the parameters of the model

**[0:55:07]** just like we're doing here

**[0:55:08]** using gradient descent

**[0:55:10]** these 10 percent of the

**[0:55:12]** examples

**[0:55:13]** the dev or validation split

**[0:55:14]** they're used for development

**[0:55:16]** over all the hyperparameters

**[0:55:17]** of your model

**[0:55:18]** so hyperparameters

**[0:55:19]** are for example

**[0:55:20]** the size of this hidden layer

**[0:55:22]** the size of the embedding

**[0:55:24]** so this is a hundred

**[0:55:25]** or a two for us

**[0:55:25]** but we could try different things

**[0:55:27]** of the strength of the realization

**[0:55:29]** which we aren't using yet so far

**[0:55:31]** so there's lots of different hyperparameters

**[0:55:33]** and settings

**[0:55:34]** that go into defining your neural net

**[0:55:36]** and you can try many different variations of them

**[0:55:38]** and see

**[0:55:38]** whichever one works best

**[0:55:40]** on your validation split

**[0:55:43]** so this is used to train the parameters

**[0:55:45]** this is used to train the hyperparameters

**[0:55:48]** and test split

**[0:55:49]** is used to evaluate

**[0:55:51]** basically the performance

**[0:55:52]** of the model at the end

**[0:55:54]** so we're only evaluating

**[0:55:55]** the loss on the test split

**[0:55:56]** very very sparingly

**[0:55:57]** and very few times

**[0:55:58]** because every single time

**[0:56:00]** you evaluate your test loss

**[0:56:01]** and you learn something from it

**[0:56:03]** you are basically starting to

**[0:56:05]** also train

**[0:56:06]** on the test split

**[0:56:08]** so you are only allowed to

**[0:56:09]** test the loss on the test set

**[0:56:13]** very very few times

**[0:56:14]** otherwise you risk

**[0:56:15]** overfitting to it as well

**[0:56:17]** as you experiment on your model

**[0:56:19]** so let's also split up our train data

**[0:56:22]** into train, dev and test

**[0:56:24]** and then we are going to train on train

**[0:56:26]** and only evaluate on test

**[0:56:27]** very very sparingly

**[0:56:29]** okay so here we go

**[0:56:31]** here is where we took all the words

**[0:56:33]** and put them into x and y tensors

**[0:56:36]** so instead let me create a new cell here

**[0:56:38]** and let me just copy paste some code here

**[0:56:40]** because I don't think it's that complex

**[0:56:43]** but we're going to try to save a little bit of time

**[0:56:47]** I'm converting this to be a function now

**[0:56:49]** and this function takes some list of words

**[0:56:52]** and builds the arrays x and y

**[0:56:54]** for those words only

**[0:56:56]** and then here I am shuffling up all the words

**[0:56:59]** so these are the input words that we get

**[0:57:02]** we are randomly shuffling them all up

**[0:57:04]** and then we're going to set n1 to be

**[0:57:09]** the number of examples there's 80% of the words

**[0:57:12]** and n2 to be 90% of the way of the words

**[0:57:16]** so basically if length of words is 30 000

**[0:57:19]** n1 is

**[0:57:21]** well sorry I should probably run this

**[0:57:24]** n1 is 25 000 and n2 is 28 000

**[0:57:28]** and so here we see that I'm calling build data set

**[0:57:31]** to build a training set x and y

**[0:57:33]** by indexing into up to n1

**[0:57:36]** so we're going to have only 25 000 training words

**[0:57:39]** and then we're going to have

**[0:57:42]** roughly n2 minus n1

**[0:57:46]** 3000 validation examples or dev examples

**[0:57:50]** and we're going to have

**[0:57:53]** length of words basically minus n2

**[0:57:57]** or 3 204 examples here for the test set

**[0:58:03]** so now we have x's and y's for all those three splits

**[0:58:13]** oh yeah I'm printing their size here inside the function as well

**[0:58:18]** but here we don't have words but these are already

**[0:58:21]** the individual examples made from those words

**[0:58:25]** so let's now scroll down here

**[0:58:27]** and the data set now for training is

**[0:58:31]** more like this

**[0:58:33]** and then when we reset the network

**[0:58:38]** when we're training we're only going to be training

**[0:58:40]** using x train

**[0:58:43]** x train and y train

**[0:58:47]** so that's the only thing we're training on

**[0:58:57]** let's see where we are on a single batch

**[0:59:02]** let's now train maybe a few more steps

**[0:59:07]** training neural networks can take a while

**[0:59:09]** usually you don't do it in line

**[0:59:11]** you launch a bunch of jobs

**[0:59:12]** and you wait for them to finish

**[0:59:14]** can take a multiple days and so on

**[0:59:16]** luckily this is a very small network

**[0:59:20]** okay so the loss is pretty good

**[0:59:23]** oh we accidentally used our learning rate

**[0:59:25]** that is way too low

**[0:59:27]** so let me actually come back

**[0:59:29]** we used the decay learning rate of 0.01

**[0:59:35]** so this will train much faster

**[0:59:37]** and then here when we evaluate

**[0:59:39]** let's use the depth set here

**[0:59:42]** x dev and y dev to evaluate the loss

**[0:59:47]** okay and let's now decay the learning rate

**[0:59:50]** and only do say 10,000 examples

**[0:59:53]** and let's evaluate the dev loss

**[0:59:57]** once here

**[0:59:59]** okay so we're getting about 2.3 on dev

**[1:00:01]** and so the neural network when it was training

**[1:00:03]** did not see these dev examples

**[1:00:05]** it hasn't optimized on them

**[1:00:07]** and yet when we evaluate the loss on these dev

**[1:00:10]** we actually get a pretty decent loss

**[1:00:12]** and so we can also look at what the

**[1:00:16]** loss is on all of training set

**[1:00:18]** oops

**[1:00:20]** and so we see that the training

**[1:00:22]** and the dev loss are about equal

**[1:00:24]** so we're not overfitting

**[1:00:26]** this model is not powerful enough

**[1:00:28]** to just be purely memorizing the data

**[1:00:30]** and so far we are what's called underfitting

**[1:00:33]** because the training loss and the dev or test losses

**[1:00:36]** are roughly equal

**[1:00:37]** so what that typically means

**[1:00:39]** is that our network is very tiny

**[1:00:41]** very small

**[1:00:42]** and we expect to make performance improvements

**[1:00:45]** by scaling up the size of this neural net

**[1:00:47]** so let's do that now

**[1:00:48]** so let's come over here

**[1:00:50]** and let's increase the size of the neural net

**[1:00:52]** the easiest way to do this is we can come here

**[1:00:54]** to the hidden layer

**[1:00:55]** which currently has 100 neurons

**[1:00:56]** and let's just bump this up

**[1:00:57]** so let's do 300 neurons

**[1:01:00]** and then this is also 300 biases

**[1:01:03]** and here we have 300 inputs into the final layer

**[1:01:07]** so let's initialize our neural net

**[1:01:10]** we now have 10,000 parameters

**[1:01:12]** instead of 3,000 parameters

**[1:01:15]** and then we're not using this

**[1:01:18]** and then here what I'd like to do is

**[1:01:19]** I'd like to actually keep track of

**[1:01:27]** okay let's just do this

**[1:01:28]** let's keep stats again

**[1:01:30]** and here when we're keeping track of the loss

**[1:01:35]** let's just also keep track of the steps

**[1:01:38]** and let's just have an eye here

**[1:01:40]** and let's train on 30,000

**[1:01:44]** or rather say

**[1:01:46]** okay let's try 30,000

**[1:01:48]** and we are at 0.1

**[1:01:50]** and we should be able to run this

**[1:01:54]** and optimize the neural net

**[1:01:57]** and then here basically

**[1:01:58]** I want to plt.plot the steps

**[1:02:02]** and change the loss

**[1:02:09]** so these are the x's and the y's

**[1:02:11]** and this is the loss function

**[1:02:14]** and how it's being optimized

**[1:02:16]** now you see that there's quite a bit of thickness to this

**[1:02:19]** and that's because we are optimizing over these mini batches

**[1:02:21]** and the mini batches create a little bit of noise

**[1:02:24]** in this

**[1:02:26]** where are we in the deficit

**[1:02:27]** we are at 2.5

**[1:02:28]** so we still haven't optimized this neural net very well

**[1:02:32]** and that's probably because we made it bigger

**[1:02:33]** it might take longer for this neural net to converge

**[1:02:37]** and so let's continue training

**[1:02:42]** yeah let's just continue training

**[1:02:46]** one possibility is that the batch size is so low

**[1:02:49]** that we just have way too much noise in the training

**[1:02:52]** and we may want to increase the batch size

**[1:02:54]** so that we have a bit more correct gradient

**[1:02:57]** and we're not thrashing too much

**[1:02:59]** and we can actually optimize more properly

**[1:03:08]** this will now become meaningless

**[1:03:10]** because we've re-initialized these

**[1:03:11]** so yeah this looks not pleasing right now

**[1:03:16]** but the probability is like a tiny improvement

**[1:03:17]** but it's so hard to tell

**[1:03:20]** let's go again

**[1:03:22]** 2.5.2

**[1:03:25]** let's try to decrease the learning rate by a factor of 2

**[1:03:50]** okay we're at 2.3.2

**[1:03:52]** let's continue training

**[1:04:05]** we basically expect to see a lower loss than what we had before

**[1:04:08]** because now we have a much much bigger model

**[1:04:10]** and we were underfitting

**[1:04:12]** so we'd expect that increasing the size of the model

**[1:04:13]** should help the neural net

**[1:04:16]** 2.3.2

**[1:04:16]** okay so that's not happening too well

**[1:04:19]** now one other concern is that

**[1:04:20]** even though we've made the 10h layer here

**[1:04:23]** or the hidden layer much much bigger

**[1:04:25]** it could be that the bottleneck of the network right now

**[1:04:27]** are these embeddings that are two-dimensional

**[1:04:30]** it can be that we're just cramming way too many characters

**[1:04:32]** into just two dimensions

**[1:04:33]** and the neural net is not able to really use that space effectively

**[1:04:38]** and that that is sort of like the bottleneck to our network's performance

**[1:04:42]** okay 2.23

**[1:04:43]** so just by decreasing the learning rate

**[1:04:45]** I was able to make quite a bit of progress

**[1:04:47]** let's run this one more time

**[1:04:51]** and then evaluate the training and the dev loss

**[1:04:56]** now one more thing after training that I'd like to do

**[1:04:58]** is I'd like to visualize the embedding vectors

**[1:05:04]** for these characters

**[1:05:06]** before we scale up the embedding size from 2

**[1:05:09]** because we'd like to make this bottleneck potentially go away

**[1:05:13]** but once I make this greater than 2

**[1:05:15]** we won't be able to visualize them

**[1:05:17]** so here okay we're at 2.23 and 2.24

**[1:05:21]** so we're not improving much more

**[1:05:23]** and maybe the bottleneck now is the character embedding size which is 2

**[1:05:28]** so here I have a bunch of code that will create a figure

**[1:05:31]** and then we're going to visualize

**[1:05:33]** the embeddings that were trained by the neural net

**[1:05:36]** on these characters

**[1:05:38]** because right now the embedding size is just 2

**[1:05:40]** so we can visualize all the characters

**[1:05:41]** with the x and the y coordinates

**[1:05:43]** as the two embedding locations for each of these characters

**[1:05:47]** and so here are the x coordinates and the y coordinates

**[1:05:50]** which are the columns of C

**[1:05:52]** and then for each one I also include the text of the little character

**[1:05:58]** so here what we see is actually kind of interesting

**[1:06:02]** the network has basically learned

**[1:06:04]** to separate out the characters and cluster them a little bit

**[1:06:07]** so for example you see how the vowels

**[1:06:09]** A-E-I-O-U are clustered up here

**[1:06:12]** so what that's telling us is that the neural net treats these as very similar

**[1:06:16]** right because when they feed into the neural net

**[1:06:18]** the embedding for all these characters is very similar

**[1:06:22]** and so the neural net thinks that they're very similar

**[1:06:24]** and kind of like interchangeable if that makes sense

**[1:06:29]** then the the points that are like really far away are for example q

**[1:06:32]** q is kind of treated as an exception

**[1:06:34]** and q has a very special embedding vector so to speak

**[1:06:38]** similarly dot which is a special character is all the way out here

**[1:06:42]** and a lot of the other letters are sort of like clustered up here

**[1:06:46]** and so it's kind of interesting that there's a little bit of structure here

**[1:06:50]** after the training and it's not definitely not random

**[1:06:53]** and these embeddings make sense

**[1:06:55]** so we're now going to scale up the embedding size

**[1:06:58]** and won't be able to visualize it directly

**[1:07:00]** but we expect that because we're underfitting

**[1:07:03]** and we made this layer much bigger

**[1:07:06]** and did not sufficiently improve the loss

**[1:07:08]** we're thinking that the constraint to better performance right now

**[1:07:13]** could be these embedding factors

**[1:07:14]** so let's make them bigger

**[1:07:16]** okay so let's curl up here

**[1:07:17]** and now we don't have two dimensional embeddings

**[1:07:19]** we are going to have say 10 dimensional embeddings

**[1:07:23]** for each word

**[1:07:25]** then this layer will receive three times 10

**[1:07:29]** so 30 inputs

**[1:07:31]** we'll go into the hidden layer

**[1:07:35]** let's also make the hidden layer a bit smaller

**[1:07:37]** so instead of 300 let's just do 200 neurons in that hidden layer

**[1:07:41]** so now the total number of elements will be slightly bigger at 11,000

**[1:07:47]** and then here we have to be a bit careful because

**[1:07:50]** okay the learning rate we set to 0.1

**[1:07:53]** here we are hard coding six

**[1:07:55]** and obviously if you're working in production

**[1:07:57]** you don't want to be hard coding magic numbers

**[1:07:59]** but instead of six this should now be 30

**[1:08:04]** and let's run for 50,000 iterations

**[1:08:06]** and let me split out the initialization here outside

**[1:08:10]** so that when we run this multiple times

**[1:08:12]** it's not going to wipe out our loss

**[1:08:17]** in addition to that here

**[1:08:20]** let's instead of logging in loss that item

**[1:08:22]** let's actually log the

**[1:08:25]** let's do log 10

**[1:08:28]** I believe that's a function of the loss

**[1:08:32]** and I'll show you why in a second let's optimize this

**[1:08:37]** basically I'd like to plot the log loss instead of the loss

**[1:08:40]** because when you plot the loss many times

**[1:08:41]** it can have this hockey stick appearance

**[1:08:43]** and log squashes it in

**[1:08:47]** so it just kind of like looks nicer

**[1:08:48]** so the x-axis is step i

**[1:08:51]** and the y-axis will be the loss i

**[1:08:53]** and then here this is 30

**[1:09:03]** ideally we wouldn't be hard coding these

**[1:09:08]** because let's look at the loss

**[1:09:10]** okay it's again very thick

**[1:09:13]** because the mini batch size is very small

**[1:09:15]** but the total loss over the training set is 2.3

**[1:09:17]** and the test or the dev set is 2.38 as well

**[1:09:21]** so far so good let's try to now decrease the learning rate

**[1:09:25]** by a factor of 10

**[1:09:29]** and train for another 50,000 iterations

**[1:09:35]** we'd hope that we would be able to beat 2.32

**[1:09:43]** but again we're just kind of like doing this very haphazardly

**[1:09:45]** so I don't actually have confidence that

**[1:09:48]** our learning rate is set very well

**[1:09:50]** that our learning rate decay

**[1:09:51]** which we just do at random is set very well

**[1:09:55]** and so the optimization here is kind of suspect to be honest

**[1:09:58]** and this is not how you would do it typically in production

**[1:10:01]** in production you would create parameters

**[1:10:03]** or hyperparameters out of all these settings

**[1:10:05]** and then you would run lots of experiments

**[1:10:07]** and see whichever ones are working well for you

**[1:10:11]** okay so we have 2.17 now and 2.2

**[1:10:15]** okay so you see how the training and the validation performance

**[1:10:20]** are starting to slightly slowly depart

**[1:10:23]** so maybe we're getting the sense that the neural net

**[1:10:26]** is getting good enough or that number of parameters is large enough

**[1:10:31]** that we are slowly starting to overfit

**[1:10:34]** let's maybe run one more duration of this

**[1:10:37]** and see where we get

**[1:10:41]** but yeah basically you would be running lots of experiments

**[1:10:44]** and then you are slowly scrutinizing

**[1:10:45]** whichever ones give you the best

**[1:10:47]** depth performance

**[1:10:48]** and then once you find all the hyperparameters

**[1:10:50]** that make your depth performance good

**[1:10:52]** you take that model and you evaluate the test set performance

**[1:10:55]** a single time

**[1:10:56]** and that's the number that you report in your paper

**[1:10:59]** or wherever else you want to talk about

**[1:11:00]** and brag about your model

**[1:11:05]** so let's then rerun the plot

**[1:11:07]** and rerun the train and dev

**[1:11:11]** and because we're getting lower loss now

**[1:11:12]** it is the case that the embedding size of these

**[1:11:15]** was holding us back very likely

**[1:11:20]** okay so 2.16 2.19 is what we're roughly getting

**[1:11:24]** so there's many ways to go from

**[1:11:26]** many ways to go from here

**[1:11:27]** we can continue tuning the optimization

**[1:11:30]** we can continue for example playing with the size of the neural net

**[1:11:33]** or we can increase the number of words

**[1:11:36]** or characters in our case

**[1:11:38]** that we are taking as an input

**[1:11:39]** so instead of just three characters

**[1:11:40]** we could be taking more characters than as an input

**[1:11:43]** and that could further improve the loss

**[1:11:46]** okay so I changed the code slightly

**[1:11:48]** so we have here 200,000 steps of the optimization

**[1:11:51]** and in the first 100,000 we're using a learning rate of 0.1

**[1:11:54]** and then in the next 100,000 we're using a learning rate of 0.01

**[1:11:58]** this is the loss that I achieve

**[1:12:00]** and these are the performance on the training and validation loss

**[1:12:03]** and in particular the best validation loss I've been able to obtain

**[1:12:06]** in the last 30 minutes or so

**[1:12:08]** is 2.17

**[1:12:10]** so now I invite you to beat this number

**[1:12:12]** and you have quite a few knobs available to you

**[1:12:14]** to I think surpass this number

**[1:12:16]** so number one you can of course change the number of neurons

**[1:12:19]** in the hidden layer of this model

**[1:12:21]** you can change the dimensionality of the embedding lookup table

**[1:12:25]** you can change the number of characters that are feeding in

**[1:12:28]** as an input as the context into this model

**[1:12:32]** and then of course you can change the details of the optimization

**[1:12:35]** how long are we running

**[1:12:36]** what is the learning rate

**[1:12:37]** how does it change over time

**[1:12:39]** how does it decay

**[1:12:41]** you can change the batch size

**[1:12:42]** and you may be able to actually achieve a much better

**[1:12:44]** convergence speed

**[1:12:46]** in terms of how many seconds or minutes it takes to train the model

**[1:12:50]** and get your result in terms of really good loss

**[1:12:55]** and then of course I actually invite you to read this paper

**[1:12:58]** it is 19 pages

**[1:12:59]** but at this point you should actually be able to read

**[1:13:01]** a good chunk of this paper

**[1:13:02]** and understand pretty good chunks of it

**[1:13:06]** and this paper also has quite a few ideas

**[1:13:08]** for improvements that you can play with

**[1:13:11]** so all those are knobs available to you

**[1:13:13]** and you should be able to beat this number

**[1:13:15]** I'm leaving that as an exercise to the reader

**[1:13:17]** and that's it for now

**[1:13:18]** and I'll see you next time

**[1:13:24]** before we wrap up

**[1:13:25]** I also wanted to show how you would sample from the model

**[1:13:28]** so we're going to generate 20 samples

**[1:13:31]** at first we begin with all dots

**[1:13:33]** so that's the context

**[1:13:35]** and then until we generate the 0th character again

**[1:13:40]** we're going to embed the current context

**[1:13:43]** using the embedding table C

**[1:13:45]** now usually here the first dimension was the size of the training set

**[1:13:50]** but here we're only working with a single example that we're generating

**[1:13:53]** so this is just dimension one

**[1:13:55]** just for simplicity

**[1:13:58]** and so this embedding then gets projected into the head and state

**[1:14:02]** you get the logits

**[1:14:03]** now we calculate the probabilities

**[1:14:05]** for that you can use the f.softmax

**[1:14:09]** of logits

**[1:14:09]** and that just basically exponentiates the logits

**[1:14:11]** and makes them sum to one

**[1:14:13]** and similar to cross entropy

**[1:14:15]** it is careful that there's no overflows

**[1:14:18]** once we have the probabilities

**[1:14:19]** we sample from them using torsion multinomial

**[1:14:21]** to get our next index

**[1:14:23]** and then we shift the context window to append the index

**[1:14:26]** and record it

**[1:14:28]** and then we can just decode all the integers to strings

**[1:14:31]** and print them out

**[1:14:33]** and so these are some example samples

**[1:14:34]** and you can see that the model now works much better

**[1:14:37]** so the words here are much more word like or name like

**[1:14:41]** so we have things like

**[1:14:42]** ham

**[1:14:44]** joes

**[1:14:46]** lila

**[1:14:48]** you know it's starting to sound a little bit more name like

**[1:14:50]** so we're definitely making progress

**[1:14:52]** but we can still improve on this model quite a lot

**[1:14:55]** okay sorry there's some bonus content

**[1:14:57]** I wanted to mention that

**[1:14:58]** I want to make these notebooks more accessible

**[1:15:01]** and so I don't want you to have to like

**[1:15:03]** install jpeg notebooks and torch and everything else

**[1:15:05]** so I will be sharing a link to a google collab

**[1:15:08]** and the google collab will look like a notebook in your browser

**[1:15:12]** and you can just go to your url

**[1:15:14]** and you'll be able to execute all of the code that you saw

**[1:15:17]** in the google collab

**[1:15:19]** and so this is me executing the code in this lecture

**[1:15:22]** and I shortened it a little bit

**[1:15:23]** but basically you're able to train the exact same network

**[1:15:26]** and then plot and sample from the model

**[1:15:29]** and everything is ready for you to like tinker with the numbers

**[1:15:31]** right there in your browser no installation necessary

**[1:15:35]** so I just wanted to point that out

**[1:15:36]** and the link to this will be in the video description

