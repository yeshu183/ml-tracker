import { useState, useEffect } from "react";

// ─── Storage adapter: works in Claude (window.storage) and outside (localStorage) ───
const store = {
  get: async (key) => {
    try { if (window.storage) return await window.storage.get(key); } catch {}
    const v = localStorage.getItem("mlt4_" + key);
    return v ? { value: v } : null;
  },
  set: async (key, val) => {
    try { if (window.storage) { await window.storage.set(key, val); return; } } catch {}
    localStorage.setItem("mlt4_" + key, val);
  }
};

// ─── Dark mode palette ───
const C = {
  bg:       "#0d1117",
  surface:  "#161b22",
  elevated: "#21262d",
  border:   "#30363d",
  border2:  "#21262d",
  text:     "#e6edf3",
  muted:    "#8b949e",
  dim:      "#6e7681",
  accent:   "#58a6ff",
  green:    "#3fb950",
  yellow:   "#d29922",
  purple:   "#a371f7",
  teal:     "#39d353",
  red:      "#f85149",
};

const ROADMAP = [
  {
    phase: "Foundation",
    color: "#7c3aed",
    items: [{
      id: "w0", week: "Week 0", title: "NumPy & PyTorch Foundations", duration: "1 week",
      tags: ["numpy","pytorch","setup"],
      theory: [
        { id:"t1", text:"Matrix ops: np.dot, np.matmul, @ operator", desc:"These are the primitives of every neural network layer — every forward pass is a sequence of matrix multiplications, and mixing them up causes silent wrong results.", resource:"CS231n NumPy Tutorial" },
        { id:"t2", text:"Broadcasting — operations between mismatched array shapes", desc:"NumPy silently expands arrays to compatible shapes; misunderstanding this is responsible for a large fraction of shape-related bugs in ML code.", resource:"NumPy Docs: Broadcasting" },
        { id:"t3", text:"Reshape, squeeze, expand_dims — aligning tensor dimensions", desc:"You'll fight tensor shape mismatches constantly — knowing how to reshape without copying data is essential for connecting any two components.", resource:"PyTorch 60 Minute Blitz" },
        { id:"t4", text:"Vectorized thinking — replacing for-loops with array ops", desc:"Python loops are ~100x slower than NumPy operations; writing vectorized code is required for any training that runs in reasonable time.", resource:"CS231n NumPy Tutorial" },
        { id:"t5", text:"PyTorch Autograd — requires_grad, .backward(), .grad", desc:"Autograd is what makes PyTorch PyTorch — it silently builds a computation graph and backpropagates gradients, and you need to understand this to debug anything.", resource:"Karpathy — micrograd (YouTube)" },
        { id:"t6", text:"nn.Module — subclassing, __init__ and forward", desc:"Every PyTorch model is an nn.Module; this pattern is the standard interface for parameters, layers, and forward computation.", resource:"PyTorch 60 Minute Blitz" },
        { id:"t7", text:"Training loop — forward → loss → .backward() → step → zero_grad", desc:"This is the skeleton every ML training script is built on — get it right once and you'll recognise it everywhere.", resource:"PyTorch 60 Minute Blitz" },
      ],
      resources: [
        { id:"r1", text:"CS231n NumPy Tutorial (Stanford)", url:"https://cs231n.github.io/python-numpy-tutorial/", type:"blog" },
        { id:"r2", text:"PyTorch Official 60 Minute Blitz", url:"https://pytorch.org/tutorials/beginner/deep_learning_60min_blitz.html", type:"docs" },
        { id:"r3", text:"Andrej Karpathy — micrograd (YouTube)", url:"https://www.youtube.com/watch?v=VMj-3S1tku0", type:"youtube" },
        { id:"r4", text:"Daniel Bourke — PyTorch for Deep Learning (GitHub)", url:"https://github.com/mrdbourke/pytorch-deep-learning", type:"docs" },
      ],
      implementation: [
        { id:"i1", text:"Implement linear regression forward pass + loss in pure NumPy", desc:"Forces you to understand the math before hiding it behind abstractions — if you can't do it in NumPy, you don't understand it yet." },
        { id:"i2", text:"Recreate the same in PyTorch using autograd instead of manual gradients", desc:"Comparing the two side-by-side is the fastest way to understand what autograd actually does under the hood." },
        { id:"i3", text:"Build one complete training loop with nn.Module and SGD", desc:"Writing the loop from scratch once means you'll never be confused by someone else's training code." },
        { id:"i4", text:"Plot the loss curve over epochs", desc:"Loss curve visualization is your primary debugging tool for every future project — start practising it now." },
      ],
      extraReading: [
        { id:"e1", topic:"Einstein summation (einsum)", desc:"Compact, expressive notation for tensor operations used extensively in ML papers and attention implementations.", url:"https://rockt.github.io/2018/04/30/einsum" },
        { id:"e2", topic:"NumPy view vs copy — memory implications", desc:"Understanding when NumPy creates a view vs a copy prevents subtle bugs where modifications propagate unexpectedly.", url:"https://numpy.org/doc/stable/user/basics.copies.html" },
        { id:"e3", topic:"Computational graphs — static vs dynamic (define-by-run)", desc:"PyTorch's dynamic graph is what makes debugging feel natural; understanding the tradeoff explains why TensorFlow 1.x felt so painful.", url:"https://pytorch.org/blog/computational-graphs-constructed-in-pytorch/" },
        { id:"e4", topic:"Broadcasting rules in depth — when and why it fails", desc:"The full ruleset of broadcasting has edge cases that trip up even experienced practitioners when dealing with batched operations.", url:"https://numpy.org/doc/stable/user/basics.broadcasting.html" },
        { id:"e5", topic:"Contiguous vs non-contiguous tensors — why .contiguous() exists", desc:"Non-contiguous memory layout causes certain PyTorch ops to fail; knowing when to call .contiguous() saves confusing debugging sessions.", url:"https://pytorch.org/docs/stable/tensor_attributes.html#torch.memory_format" },
      ]
    }]
  },
  {
    phase: "Core Concepts (13 Weeks)",
    color: "#1d6fe8",
    items: [
      {
        id:"c1", week:"Week 1", title:"Linear Regression", duration:"1 week",
        tags:["math","numpy","gradient descent"],
        theory: [
          { id:"t1", text:"Cost function (MSE) — loss surface geometry", desc:"MSE creates a bowl-shaped (convex) loss surface, which guarantees gradient descent will find the global minimum — this convexity property is rare and precious.", resource:"3Blue1Brown — NN Chapter 1" },
          { id:"t2", text:"Gradient descent — walking downhill on the loss surface", desc:"The most fundamental optimization algorithm in all of ML; everything from SGD to Adam is a variant of this core idea.", resource:"Andrew Ng — Coursera" },
          { id:"t3", text:"Derive the MSE gradient with respect to weights by hand", desc:"Doing this derivation on paper once builds the intuition for why the gradient points in the direction of steepest ascent and why we negate it.", resource:"Mathematics for ML Book" },
          { id:"t4", text:"Learning rate — why too high diverges, too low crawls", desc:"The learning rate is the most important hyperparameter you'll ever tune; understanding its effect geometrically prevents a lot of blind trial-and-error.", resource:"3Blue1Brown — NN Chapter 1" },
          { id:"t5", text:"Normal equation — closed-form vs iterative solution", desc:"The normal equation gives the exact answer in one step but scales poorly with data size; understanding this tradeoff explains why we use gradient descent at all.", resource:"Andrew Ng — Coursera" },
          { id:"t6", text:"Assumptions of linear regression — linearity, independence, homoscedasticity", desc:"These assumptions are why linear regression fails on most real-world problems; knowing them helps you diagnose when the model is wrong, not just when it's inaccurate.", resource:"Mathematics for ML Book" },
        ],
        resources: [
          { id:"r1", text:"3Blue1Brown — Neural Networks Chapter 1 (YouTube)", url:"https://www.youtube.com/watch?v=aircAruvnKk", type:"youtube" },
          { id:"r2", text:"Andrew Ng — Linear Regression, Week 1 (Coursera)", url:"https://www.coursera.org/learn/machine-learning", type:"docs" },
          { id:"r3", text:"Mathematics for ML Book — Chapter 5, free PDF", url:"https://mml-book.github.io/", type:"paper" },
        ],
        implementation: [
          { id:"i1", text:"Linear regression in pure NumPy — manually compute gradients", desc:"No sklearn, no PyTorch — implementing gradient descent by hand is what separates understanding from memorisation." },
          { id:"i2", text:"Plot loss curve and verify it decreases monotonically", desc:"If your loss isn't decreasing cleanly, your gradient is wrong — this is the first debugging skill to develop." },
          { id:"i3", text:"Experiment: learning rates 0.001, 0.1, 10 — observe divergence", desc:"Seeing divergence happen in your own code is more memorable than reading about it; the exploding loss will stick with you." },
          { id:"i4", text:"Compare gradient descent vs normal equation on same data", desc:"They should give the same weights; if they don't, your gradient computation has a bug." },
        ],
        extraReading: [
          { id:"e1", topic:"SGD vs mini-batch vs full-batch — tradeoffs at scale", desc:"The choice between these three determines training speed vs stability at scale, and every practitioner needs an intuition for it.", url:"https://ruder.io/optimizing-gradient-descent/" },
          { id:"e2", topic:"Convexity of MSE — why it guarantees a global minimum", desc:"Convexity is a rare and powerful property; understanding it explains why we can trust gradient descent for linear models but not neural networks.", url:"https://www.offconvex.org/2016/03/22/saddlepoints/" },
          { id:"e3", topic:"Feature scaling — effect on gradient descent convergence", desc:"Unscaled features cause elongated loss surfaces that make gradient descent inefficient; this is why standardisation is nearly always applied.", url:"https://www.jeremyjordan.me/batch-normalization/" },
          { id:"e4", topic:"Gauss-Markov theorem — why OLS is BLUE", desc:"This theorem gives the theoretical justification for linear regression; understanding it helps you know when to trust and when to abandon the model.", url:"https://en.wikipedia.org/wiki/Gauss%E2%80%93Markov_theorem" },
        ]
      },
      {
        id:"c2", week:"Week 2", title:"Logistic Regression", duration:"1 week",
        tags:["classification","sigmoid","cross-entropy"],
        theory: [
          { id:"t1", text:"Why MSE fails for classification — geometrically", desc:"MSE penalises confident correct predictions, making it actively harmful for classification; seeing this geometrically explains why cross-entropy was invented.", resource:"StatQuest — Logistic Regression" },
          { id:"t2", text:"Sigmoid function — squashes any value to (0, 1)", desc:"Sigmoid converts raw scores to probabilities; understanding its saturation behaviour explains the vanishing gradient problem you'll encounter in Week 3.", resource:"StatQuest — Logistic Regression" },
          { id:"t3", text:"Cross-entropy loss — derive from maximum likelihood estimation", desc:"Cross-entropy is not arbitrary — it's the natural loss function that falls out of maximum likelihood when your model outputs probabilities.", resource:"Chris Olah — Visual Information Theory" },
          { id:"t4", text:"Decision boundary — visualise in 2D feature space", desc:"The decision boundary is where the model is 50% confident; visualising it shows exactly what the model has learned about your data.", resource:"StatQuest — Logistic Regression" },
          { id:"t5", text:"Softmax + categorical cross-entropy for multi-class", desc:"Softmax is the multi-class generalisation of sigmoid; it normalises outputs into a probability distribution, and understanding it is required for any classification beyond binary.", resource:"Sebastian Raschka — ML from Scratch" },
        ],
        resources: [
          { id:"r1", text:"StatQuest — Logistic Regression (YouTube)", url:"https://www.youtube.com/watch?v=yIYKR4sgzI8", type:"youtube" },
          { id:"r2", text:"Chris Olah — Visual Information Theory (blog)", url:"https://colah.github.io/posts/2015-09-Visual-Information/", type:"blog" },
          { id:"r3", text:"Sebastian Raschka — ML from Scratch (GitHub)", url:"https://github.com/rasbt/machine-learning-book", type:"docs" },
        ],
        implementation: [
          { id:"i1", text:"Binary classifier in pure NumPy from scratch", desc:"Sigmoid, cross-entropy, and gradient update all written by hand — the foundation of every classification model you'll ever build." },
          { id:"i2", text:"Generate 2D dataset and plot the decision boundary", desc:"Visualising the boundary shows you whether your model has actually learned the right separation or is just memorising." },
          { id:"i3", text:"Compare cross-entropy vs MSE on same classification task", desc:"Training the same model with both losses and plotting the difference is the clearest way to understand why cross-entropy exists." },
          { id:"i4", text:"Extend to multi-class with softmax", desc:"Once you implement multi-class from scratch, every classification model in PyTorch will make complete sense." },
        ],
        extraReading: [
          { id:"e1", topic:"Information theory — entropy, KL divergence, cross-entropy connection", desc:"Cross-entropy loss has a deep connection to information theory that explains why it's the right choice for probability outputs.", url:"https://colah.github.io/posts/2015-09-Visual-Information/" },
          { id:"e2", topic:"Maximum Likelihood Estimation — theoretical basis for loss functions", desc:"MLE is the principled framework that generates most ML loss functions; understanding it lets you derive your own loss for any problem.", url:"https://gregorygundersen.com/blog/2019/11/16/mle/" },
          { id:"e3", topic:"Log-sum-exp trick — numerical stability for softmax", desc:"Naive softmax overflows for large logits; the log-sum-exp trick is a standard numerical stability fix used in every major ML framework.", url:"https://gregorygundersen.com/blog/2020/02/09/log-sum-exp/" },
          { id:"e4", topic:"ROC curves and AUC — why accuracy is a bad metric", desc:"Accuracy is misleading on imbalanced datasets; ROC/AUC gives a more complete picture of classifier performance across all decision thresholds.", url:"https://developers.google.com/machine-learning/crash-course/classification/roc-and-auc" },
          { id:"e5", topic:"Calibration — does predicted probability match true frequency?", desc:"A well-calibrated model that says 80% confident should be right 80% of the time; miscalibrated models are dangerous in high-stakes applications.", url:"https://scikit-learn.org/stable/modules/calibration.html" },
        ]
      },
      {
        id:"c3", week:"Weeks 3–4", title:"Backpropagation & Neural Networks", duration:"2 weeks",
        tags:["backprop","chain rule","autograd"],
        theory: [
          { id:"t1", text:"The chain rule — derive from calculus first principles", desc:"Backprop is the chain rule applied recursively across a computation graph; deriving it yourself removes all the mystery from automatic differentiation.", resource:"3Blue1Brown — Backpropagation" },
          { id:"t2", text:"Computational graphs — how ops build a DAG", desc:"Every operation in a neural network creates a node in a directed acyclic graph; this structure is what makes gradient flow possible.", resource:"CS231n — Backprop Notes" },
          { id:"t3", text:"Forward pass — computing outputs layer by layer", desc:"The forward pass transforms input data into predictions; tracing it layer by layer is the first step to understanding any architecture.", resource:"Karpathy — Zero to Hero" },
          { id:"t4", text:"Backward pass — propagating gradients from loss to every weight", desc:"The backward pass is where learning actually happens — gradients tell each weight how to change to reduce the loss.", resource:"3Blue1Brown — Backpropagation" },
          { id:"t5", text:"Weight initialisation — Xavier/He and why it matters", desc:"Bad initialisation causes gradients to vanish or explode before training even starts; Xavier and He initialisation are the principled solutions.", resource:"CS231n — Backprop Notes" },
          { id:"t6", text:"Activation functions — ReLU, tanh, sigmoid and gradient properties", desc:"The choice of activation function determines whether gradients flow cleanly through a network; ReLU's key property is that its gradient is 1 for positive inputs.", resource:"Karpathy — Zero to Hero" },
          { id:"t7", text:"Vanishing/exploding gradients — conceptual understanding", desc:"Understanding why gradients shrink or explode through many layers is the prerequisite for understanding every architectural innovation from LSTMs to Transformers.", resource:"3Blue1Brown — Backpropagation" },
        ],
        resources: [
          { id:"r1", text:"3Blue1Brown — Backpropagation Series (YouTube)", url:"https://www.youtube.com/watch?v=Ilg3gGewQ5U", type:"youtube" },
          { id:"r2", text:"Andrej Karpathy — Neural Networks: Zero to Hero (series)", url:"https://karpathy.ai/zero-to-hero.html", type:"youtube" },
          { id:"r3", text:"CS231n — Backpropagation Notes (blog)", url:"https://cs231n.github.io/optimization-2/", type:"blog" },
          { id:"r4", text:"Karpathy — micrograd (YouTube)", url:"https://www.youtube.com/watch?v=VMj-3S1tku0", type:"youtube" },
        ],
        implementation: [
          { id:"i1", text:"Implement micrograd — type every line yourself", desc:"Karpathy's micrograd is 100 lines that contain all of deep learning's math; typing it yourself is the single best thing you can do this month." },
          { id:"i2", text:"2-layer neural network in NumPy with manual forward + backward", desc:"Implementing backprop from scratch in NumPy is the proving ground — if you can do this, you understand neural networks." },
          { id:"i3", text:"Verify your gradients match PyTorch autograd (gradient checking)", desc:"Gradient checking — comparing your manual gradients to PyTorch's numerical estimates — is the definitive correctness test." },
          { id:"i4", text:"Experiment with different activation functions", desc:"Training the same architecture with ReLU, tanh, and sigmoid and observing the differences gives you tactile intuition about activation choice." },
          { id:"i5", text:"Observe bad initialisation — all zeros, all ones, too large", desc:"Watching training fail due to bad initialisation makes the problem concrete; after this you'll never forget why initialisation matters." },
        ],
        extraReading: [
          { id:"e1", topic:"Automatic differentiation — forward-mode vs reverse-mode", desc:"Backprop is reverse-mode autodiff; understanding why reverse-mode is efficient for many-parameter models explains PyTorch's design choices.", url:"https://explained.ai/matrix-calculus/" },
          { id:"e2", topic:"Dead ReLU problem — neurons that permanently stop firing", desc:"ReLUs can permanently output zero if they receive large negative inputs; understanding this explains why He initialisation and careful learning rates matter.", url:"https://towardsdatascience.com/the-dying-relu-problem-clearly-explained-42d0c54e0d24" },
          { id:"e3", topic:"Batch normalisation internals — how it rescales activations", desc:"Batch norm normalises activations mid-network to stabilise training; understanding its internals explains why it behaves differently during train vs eval.", url:"https://towardsdatascience.com/batch-normalization-in-neural-networks-1ac91516821c" },
          { id:"e4", topic:"Residual connections — why skip connections fix deep training", desc:"The original ResNet paper's key insight is that it's easier to learn a residual (change) than the full function; this idea shows up in every modern architecture.", url:"https://arxiv.org/abs/1512.03385" },
          { id:"e5", topic:"Universal approximation theorem — what it guarantees (and doesn't)", desc:"The theorem says a neural network with enough neurons can approximate any function — but it says nothing about whether gradient descent will actually find it.", url:"https://en.wikipedia.org/wiki/Universal_approximation_theorem" },
        ]
      },
      {
        id:"c4", week:"Week 5", title:"Principal Component Analysis (PCA)", duration:"1 week",
        tags:["linear algebra","dimensionality","eigenvectors"],
        theory: [
          { id:"t1", text:"Eigenvectors and eigenvalues — directions that don't rotate", desc:"An eigenvector is a direction the matrix only scales, never rotates; this geometric intuition is the key to understanding PCA.", resource:"3Blue1Brown — Eigenvectors" },
          { id:"t2", text:"Covariance matrix — what it captures about spread and correlation", desc:"The covariance matrix encodes how every feature relates to every other feature; its eigenvectors point in the directions of greatest variance.", resource:"StatQuest — PCA" },
          { id:"t3", text:"Why maximising variance gives the most informative directions", desc:"The directions of greatest variance preserve the most information when you project onto them; low-variance directions are mostly noise.", resource:"StatQuest — PCA" },
          { id:"t4", text:"SVD — PCA is SVD under the hood", desc:"Singular Value Decomposition is a more numerically stable way to compute PCA; understanding this connection demystifies both operations.", resource:"Jake VanderPlas — PCA in Python" },
          { id:"t5", text:"Explained variance ratio — how to choose number of components", desc:"The explained variance curve tells you how much information each component captures; the 'elbow' in the plot is where you typically cut off.", resource:"StatQuest — PCA" },
        ],
        resources: [
          { id:"r1", text:"3Blue1Brown — Eigenvectors and Eigenvalues (YouTube)", url:"https://www.youtube.com/watch?v=PFDu9oVAE-g", type:"youtube" },
          { id:"r2", text:"StatQuest — PCA Step by Step (YouTube)", url:"https://www.youtube.com/watch?v=FgakZw6K1QQ", type:"youtube" },
          { id:"r3", text:"Jake VanderPlas — PCA in Python (blog)", url:"https://jakevdp.github.io/PythonDataScienceHandbook/05.09-principal-component-analysis.html", type:"blog" },
        ],
        implementation: [
          { id:"i1", text:"Implement PCA from scratch in NumPy using SVD", desc:"No sklearn — computing the covariance matrix, running SVD, and projecting data manually makes the algorithm concrete." },
          { id:"i2", text:"Apply to 3D data, reduce to 2D, visualise before and after", desc:"Seeing 3D data collapse onto a 2D plane — and noticing how much structure is preserved — makes projection tangible." },
          { id:"i3", text:"Apply to face images — visualise 'eigenfaces'", desc:"Eigenfaces are one of the most striking visualisations in all of ML; seeing faces emerge from eigenvectors is genuinely illuminating." },
          { id:"i4", text:"Compare your result with sklearn's PCA — should match exactly", desc:"This is a correctness check; any mismatch means a bug in your implementation." },
          { id:"i5", text:"Plot explained variance curve — find the 'elbow'", desc:"Choosing the right number of components by reading this curve is a practical skill you'll use in many future projects." },
        ],
        extraReading: [
          { id:"e1", topic:"t-SNE and UMAP — nonlinear dimensionality reduction", desc:"PCA is linear; t-SNE and UMAP can unfold curved, nonlinear manifolds in the data that PCA misses — essential for visualising embeddings.", url:"https://distill.pub/2016/misread-tsne/" },
          { id:"e2", topic:"Kernel PCA — extending PCA to nonlinear relationships", desc:"Kernel PCA applies the kernel trick to PCA, allowing it to find nonlinear structure without explicitly computing high-dimensional features.", url:"https://sebastianraschka.com/Articles/2014_kernel_pca.html" },
          { id:"e3", topic:"ICA vs PCA — independent components vs maximum variance", desc:"ICA finds statistically independent components rather than maximum variance directions; it's used in signal separation and neuroimaging.", url:"https://towardsdatascience.com/independent-component-analysis-ica-a3eba0ccec35" },
          { id:"e4", topic:"Whitening / ZCA transform — removing feature correlations", desc:"Whitening is a preprocessing step that decorrelates features and normalises their variance; it's sometimes used before PCA or as a data normalisation step.", url:"https://en.wikipedia.org/wiki/Whitening_transformation" },
        ]
      },
      {
        id:"c5", week:"Week 6", title:"Regularisation (L1, L2, Dropout)", duration:"1 week",
        tags:["overfitting","generalisation"],
        theory: [
          { id:"t1", text:"Overfitting as memorising noise — polynomial fit visualisation", desc:"A high-degree polynomial can fit any training data perfectly but fails completely on new data; this is the clearest demonstration of overfitting.", resource:"StatQuest — Regularisation" },
          { id:"t2", text:"L2 (Ridge) — geometrically constrains weights to a sphere", desc:"L2 regularisation adds a penalty proportional to the square of weights, which geometrically constrains the solution to lie within a sphere centred at zero.", resource:"Deep Learning Book — Ch. 7" },
          { id:"t3", text:"L1 (Lasso) — promotes sparsity via diamond constraint", desc:"L1's diamond-shaped constraint intersects the loss surface at corners (where some weights are exactly zero), which is why L1 promotes sparse solutions.", resource:"Deep Learning Book — Ch. 7" },
          { id:"t4", text:"Dropout — training an ensemble of sub-networks simultaneously", desc:"Dropout randomly zeros out neurons during training, which forces the network to learn redundant representations and prevents co-adaptation.", resource:"Original Dropout Paper" },
          { id:"t5", text:"Bias-variance tradeoff — the tension regularisation manages", desc:"High bias means underfitting, high variance means overfitting; regularisation moves you along this tradeoff towards better generalisation.", resource:"StatQuest — Regularisation" },
          { id:"t6", text:"Early stopping — validation loss as an implicit regulariser", desc:"Stopping training when validation loss starts rising is free regularisation; it prevents the model from over-specialising to training data.", resource:"Deep Learning Book — Ch. 7" },
        ],
        resources: [
          { id:"r1", text:"StatQuest — Regularisation (YouTube)", url:"https://www.youtube.com/watch?v=Q81RR3yKn30", type:"youtube" },
          { id:"r2", text:"Deep Learning Book — Chapter 7, free online", url:"https://www.deeplearningbook.org/contents/regularization.html", type:"paper" },
          { id:"r3", text:"Original Dropout Paper — Srivastava et al. 2014", url:"https://jmlr.org/papers/v15/srivastava14a.html", type:"paper" },
        ],
        implementation: [
          { id:"i1", text:"Add L2 regularisation manually to Week 1 linear regression", desc:"Adding λ * sum(weights²) to the loss and recomputing the gradient by hand makes the math concrete." },
          { id:"i2", text:"Add manual dropout to Week 3 neural network", desc:"Implementing dropout requires keeping a mask of which neurons are active; implementing it manually clarifies how inference differs from training." },
          { id:"i3", text:"Deliberately overfit a small dataset, then add regularisation", desc:"Overfitting on purpose first gives you a baseline to compare against — seeing the gap shrink with regularisation is the most convincing demonstration." },
          { id:"i4", text:"Plot train vs validation loss for both cases", desc:"The train/val gap is the definition of overfitting; watching it close with regularisation is more instructive than any diagram." },
          { id:"i5", text:"Compare L1 vs L2 — observe which pushes weights to zero", desc:"Training the same model with both and inspecting the weight distributions shows L1's sparsity effect clearly." },
        ],
        extraReading: [
          { id:"e1", topic:"Bayesian interpretation of L2 — Gaussian prior over weights", desc:"L2 regularisation has a Bayesian interpretation as placing a Gaussian prior over weights; this framework lets you reason about regularisation more principled.", url:"https://agustinus.kristia.de/techblog/2017/02/04/bayesian-regularization/" },
          { id:"e2", topic:"Double descent — why more parameters can reduce test error", desc:"Contrary to classical statistics, very overparameterised models can generalise well; the double descent phenomenon challenges the traditional bias-variance intuition.", url:"https://openai.com/index/deep-double-descent/" },
          { id:"e3", topic:"Data augmentation as implicit regularisation", desc:"Augmenting training data with transformations (flips, crops, noise) is a form of regularisation that encodes domain knowledge about what transformations should be invariant.", url:"https://neptune.ai/blog/data-augmentation-in-python" },
          { id:"e4", topic:"Stochastic depth — randomly dropping entire layers during training", desc:"An extreme form of dropout that drops entire residual blocks during training, which improves regularisation in very deep networks.", url:"https://arxiv.org/abs/1603.09382" },
        ]
      },
      {
        id:"c6", week:"Weeks 7–8", title:"Convolutional Neural Networks", duration:"2 weeks",
        tags:["vision","filters","pooling"],
        theory: [
          { id:"t1", text:"Why fully-connected layers fail for images", desc:"A 224×224 RGB image has 150,528 inputs; fully-connected layers would need billions of parameters and no spatial structure, which is why CNNs were invented.", resource:"CS231n — CNN Notes" },
          { id:"t2", text:"Convolution as a sliding similarity measurement", desc:"A filter slides across the image computing dot products — it fires strongly where the image resembles the filter, which is how edge detectors and texture detectors emerge.", resource:"Chris Olah — Understanding Convolutions" },
          { id:"t3", text:"Translation invariance — the key property for vision", desc:"A cat is a cat whether it's in the top-left or bottom-right of the image; convolutions with pooling provide approximate translation invariance.", resource:"CS231n — CNN Notes" },
          { id:"t4", text:"Pooling — spatial compression preserving dominant features", desc:"Max pooling keeps the strongest activation in each region, which discards precise location while preserving what was detected — a useful inductive bias.", resource:"CS231n — CNN Notes" },
          { id:"t5", text:"Receptive field — deep layers see larger input regions", desc:"Each convolutional layer's neurons see a patch of the input; stacking layers increases this patch, allowing the network to detect increasingly abstract patterns.", resource:"CS231n — CNN Notes" },
          { id:"t6", text:"Famous architectures — AlexNet → VGG → ResNet contributions", desc:"Each architecture solved a specific problem: AlexNet showed deep CNNs work, VGG showed depth matters, ResNet showed residuals let you go much deeper.", resource:"3Blue1Brown — CNNs" },
        ],
        resources: [
          { id:"r1", text:"CS231n — Convolutional Neural Networks (lecture notes)", url:"https://cs231n.github.io/convolutional-networks/", type:"blog" },
          { id:"r2", text:"3Blue1Brown — CNNs (YouTube)", url:"https://www.youtube.com/watch?v=KuXjwB4LzSA", type:"youtube" },
          { id:"r3", text:"Chris Olah — Understanding Convolutions (blog)", url:"https://colah.github.io/posts/2014-07-Understanding-Convolutions/", type:"blog" },
        ],
        implementation: [
          { id:"i1", text:"Implement convolution operation from scratch in NumPy", desc:"Writing the sliding window dot product in pure NumPy makes the operation completely concrete — no 'magic' convolution layer anymore." },
          { id:"i2", text:"Visualise what different filters do to an image", desc:"Applying Sobel edge detectors, Gaussian blurs, and sharpening kernels manually shows you what 'filters' actually are before learning them." },
          { id:"i3", text:"Build a CNN in pure PyTorch — train on MNIST", desc:"No Sequential shortcuts — defining each layer manually and tracing the shapes through the forward pass builds real architectural understanding." },
          { id:"i4", text:"Visualise learned filters after training", desc:"Trained first-layer filters typically show edge detectors and colour gradients; seeing this emerge from data is one of the most compelling moments in learning ML." },
          { id:"i5", text:"Implement a residual block and compare to no residuals", desc:"Adding a skip connection is one line of code; comparing training curves with and without it demonstrates why ResNets were such a breakthrough." },
        ],
        extraReading: [
          { id:"e1", topic:"Dilated / atrous convolutions — larger receptive field without parameters", desc:"Dilated convolutions insert gaps between filter elements to cover a larger area without increasing the number of parameters — key in segmentation models.", url:"https://arxiv.org/abs/1511.07122" },
          { id:"e2", topic:"Depthwise separable convolutions — MobileNet's efficiency trick", desc:"Splitting a standard convolution into depthwise then pointwise steps reduces computation by ~8x, enabling powerful models on mobile hardware.", url:"https://towardsdatascience.com/a-basic-introduction-to-separable-convolutions-b99ec3102728" },
          { id:"e3", topic:"Feature Pyramid Networks (FPN) — multi-scale detection", desc:"FPNs build a feature hierarchy at multiple scales and merge them, enabling detection of objects at very different sizes in the same image.", url:"https://arxiv.org/abs/1612.03144" },
          { id:"e4", topic:"Deformable convolutions — learning where to look", desc:"Instead of a fixed grid, deformable convolutions learn offsets for each filter location, allowing the network to focus on geometrically irregular regions.", url:"https://arxiv.org/abs/1703.06211" },
        ]
      },
      {
        id:"c7", week:"Week 9", title:"Word Embeddings & Word2Vec", duration:"1 week",
        tags:["nlp","embeddings","latent space"],
        theory: [
          { id:"t1", text:"Skip-gram objective — predict context from center word", desc:"The skip-gram model trains by predicting what words appear near a given word; this seemingly simple task forces the model to encode semantic meaning.", resource:"Chris McCormick — Word2Vec Tutorial" },
          { id:"t2", text:"Distributional hypothesis — similar contexts → similar vectors", desc:"Words that appear in similar contexts tend to have similar meanings; Word2Vec exploits this hypothesis to learn semantic representations from raw text.", resource:"StatQuest — Word2Vec" },
          { id:"t3", text:"Word vector geometry — analogies as vector arithmetic", desc:"King - Man + Woman ≈ Queen: the geometry of trained word vectors encodes semantic relationships in a way that feels almost magical until you understand why.", resource:"Original Word2Vec Paper" },
          { id:"t4", text:"Negative sampling — making training tractable", desc:"Computing softmax over the full vocabulary is impossibly slow; negative sampling approximates it by contrasting the target word against a few random negatives.", resource:"Chris McCormick — Word2Vec Tutorial" },
          { id:"t5", text:"Why embeddings matter — reusable learned representations", desc:"Embeddings learned on large text corpora encode knowledge that transfers to downstream tasks; this idea of pre-training and reusing representations underpins all of modern NLP.", resource:"Original Word2Vec Paper" },
        ],
        resources: [
          { id:"r1", text:"Original Word2Vec Paper — Mikolov et al. 2013", url:"https://arxiv.org/abs/1301.3781", type:"paper" },
          { id:"r2", text:"Chris McCormick — Word2Vec Tutorial (blog)", url:"https://mccormickml.com/2016/04/19/word2vec-tutorial-the-skip-gram-model/", type:"blog" },
          { id:"r3", text:"StatQuest — Word Embedding / Word2Vec (YouTube)", url:"https://www.youtube.com/watch?v=viZrOnJclY0", type:"youtube" },
        ],
        implementation: [
          { id:"i1", text:"Implement skip-gram Word2Vec in PyTorch from scratch", desc:"The embedding table, the context prediction, the negative sampling loss — implementing all of this makes the concept concrete." },
          { id:"i2", text:"Train on a small corpus and visualise with PCA", desc:"Plotting your trained word vectors using the PCA you built in Week 5 shows semantic clusters forming — one of the most satisfying moments in this curriculum." },
          { id:"i3", text:"Test word analogies — king - man + woman", desc:"If your implementation is correct, the analogies should work; failing analogies tell you something is wrong with your training." },
          { id:"i4", text:"Implement negative sampling to speed up training", desc:"The difference in training speed between full softmax and negative sampling is dramatic; experiencing this makes the design choice clear." },
        ],
        extraReading: [
          { id:"e1", topic:"GloVe — global co-occurrence statistics vs local context windows", desc:"GloVe uses global word co-occurrence counts rather than local context windows, which gives it different properties and sometimes better analogies.", url:"https://nlp.stanford.edu/projects/glove/" },
          { id:"e2", topic:"FastText — subword embeddings for OOV words", desc:"FastText represents words as sums of character n-gram embeddings, which lets it handle words never seen during training — a crucial practical advantage.", url:"https://fasttext.cc/" },
          { id:"e3", topic:"Sentence embeddings — SBERT and sentence-level representations", desc:"Word2Vec gives word-level vectors; SBERT extends this to sentence-level representations by fine-tuning BERT with contrastive learning.", url:"https://www.sbert.net/" },
          { id:"e4", topic:"Polysemy problem — why 'bank' gets one vector", desc:"A word like 'bank' has multiple meanings but Word2Vec gives it one vector; this fundamental limitation motivated contextualised embeddings like ELMo and BERT.", url:"https://arxiv.org/abs/1802.05365" },
        ]
      },
      {
        id:"c8", week:"Week 10", title:"Recurrent Neural Networks", duration:"1 week",
        tags:["sequence","memory","vanishing gradients"],
        theory: [
          { id:"t1", text:"Hidden state — carrying information through time steps", desc:"The hidden state is the RNN's memory; it's updated at each step based on the current input and the previous state, allowing the model to remember context.", resource:"Chris Olah — Understanding LSTMs" },
          { id:"t2", text:"BPTT — backpropagation through time, gradient flow", desc:"Training RNNs requires unrolling the network through time and backpropagating through every step; this is where vanishing gradients become severe.", resource:"Chris Olah — Understanding LSTMs" },
          { id:"t3", text:"Vanishing gradient problem — why long-range memory fails", desc:"Gradients shrink multiplicatively with each time step; for sequences of length 100, the gradient at step 1 is effectively zero, so the model can't learn long-range dependencies.", resource:"Karpathy — Unreasonable Effectiveness" },
          { id:"t4", text:"LSTM gating — input, forget, output gates", desc:"LSTM gates are sigmoid-activated controllers that decide what to write, what to erase, and what to output; they create gradient highways that allow learning over long sequences.", resource:"Chris Olah — Understanding LSTMs" },
          { id:"t5", text:"GRU — simpler gating, often comparable to LSTM", desc:"GRU merges the forget and input gates into one update gate, reducing parameters while often achieving similar performance to LSTM.", resource:"Chris Olah — Understanding LSTMs" },
        ],
        resources: [
          { id:"r1", text:"Chris Olah — Understanding LSTMs (blog)", url:"https://colah.github.io/posts/2015-08-Understanding-LSTMs/", type:"blog" },
          { id:"r2", text:"Andrej Karpathy — Unreasonable Effectiveness of RNNs (blog)", url:"http://karpathy.github.io/2015/05/21/rnn-effectiveness/", type:"blog" },
          { id:"r3", text:"Karpathy — makemore (YouTube series)", url:"https://www.youtube.com/watch?v=PaCmpygFfXo", type:"youtube" },
        ],
        implementation: [
          { id:"i1", text:"Character-level RNN in pure PyTorch from scratch", desc:"Implementing the hidden state update rule manually gives you the clearest understanding of what 'memory' means in an RNN." },
          { id:"i2", text:"Train to generate text — names, Shakespeare, code", desc:"Watching a model start generating plausible text after a few epochs is deeply satisfying and builds intuition for what the model has learned." },
          { id:"i3", text:"Train on long sequences — observe the failure", desc:"Deliberately trying to learn long-range dependencies and watching the model fail makes the vanishing gradient problem real rather than theoretical." },
          { id:"i4", text:"Implement LSTM and compare to vanilla RNN", desc:"The performance difference on long sequences is dramatic; experiencing this makes LSTM's design feel inevitable rather than arbitrary." },
          { id:"i5", text:"Visualise hidden states over a sequence", desc:"Plotting hidden state activations over time often reveals that certain neurons track meaningful syntactic or semantic properties of the sequence." },
        ],
        extraReading: [
          { id:"e1", topic:"Gradient clipping — fix for exploding gradients", desc:"Clipping the gradient norm to a maximum value is a simple but effective fix for exploding gradients in RNNs; it's enabled by default in most training code.", url:"https://towardsdatascience.com/what-is-gradient-clipping-b8e815cdfb48" },
          { id:"e2", topic:"Sequence-to-sequence models — encoder-decoder for translation", desc:"Seq2seq uses an RNN encoder to compress a sentence into a vector and an RNN decoder to generate the translation — the architecture that dominated NLP before Transformers.", url:"https://arxiv.org/abs/1409.3215" },
          { id:"e3", topic:"CTC loss — training without aligned labels", desc:"Connectionist Temporal Classification allows training speech recognition models without knowing which input frame corresponds to which output character.", url:"https://distill.pub/2017/ctc/" },
          { id:"e4", topic:"Neural Turing Machines — RNNs with external memory", desc:"NTMs augment RNNs with a differentiable external memory bank, allowing them to perform algorithmic tasks that require precise memory storage and retrieval.", url:"https://arxiv.org/abs/1410.5401" },
        ]
      },
      {
        id:"c9", week:"Week 11", title:"Attention Mechanism", duration:"1 week",
        tags:["attention","QKV","transformers"],
        theory: [
          { id:"t1", text:"QKV framework — differentiable soft search", desc:"Queries ask questions, Keys label what's stored, Values are the content; attention computes a weighted sum of Values based on how well each Query matches each Key.", resource:"Jay Alammar — Visualising Attention" },
          { id:"t2", text:"Scaled dot-product attention — derive the formula", desc:"Deriving attention from scratch makes the formula stop feeling arbitrary; the scaling by sqrt(d_k) is the only non-obvious step and it has a clean probabilistic justification.", resource:"Lilian Weng — Attention? Attention!" },
          { id:"t3", text:"Why scale by sqrt(d_k) — prevent softmax saturation", desc:"For large d_k, dot products become large and softmax enters its saturation region where gradients vanish; dividing by sqrt(d_k) keeps the values in a healthy range.", resource:"Vaswani et al. — Attention is All You Need" },
          { id:"t4", text:"Multi-head attention — parallel attention with different perspectives", desc:"Multiple attention heads let the model attend to different aspects of the input simultaneously — one head might track syntax, another semantics.", resource:"Jay Alammar — Visualising Attention" },
          { id:"t5", text:"Self-attention vs cross-attention", desc:"Self-attention lets each token attend to all other tokens in the same sequence; cross-attention lets tokens in one sequence attend to another sequence, enabling encoder-decoder communication.", resource:"Lilian Weng — Attention? Attention!" },
          { id:"t6", text:"How attention solves the RNN long-range dependency problem", desc:"Attention gives every position direct access to every other position in O(1) steps, completely bypassing the sequential bottleneck that caused RNNs to forget.", resource:"Vaswani et al. — Attention is All You Need" },
        ],
        resources: [
          { id:"r1", text:"Jay Alammar — Visualising Attention (blog)", url:"https://jalammar.github.io/visualizing-neural-machine-translation-mechanics-of-seq2seq-models-with-attention/", type:"blog" },
          { id:"r2", text:"Lilian Weng — Attention? Attention! (blog)", url:"https://lilianweng.github.io/posts/2018-06-24-attention/", type:"blog" },
          { id:"r3", text:"Vaswani et al. — Attention is All You Need (paper)", url:"https://arxiv.org/abs/1706.03762", type:"paper" },
          { id:"r4", text:"Bahdanau et al. — Original Attention Paper (paper)", url:"https://arxiv.org/abs/1409.0473", type:"paper" },
        ],
        implementation: [
          { id:"i1", text:"Implement scaled dot-product attention — every matmul by hand", desc:"No nn.MultiheadAttention — computing Q@K.T / sqrt(d_k), softmax, then @V yourself makes the mechanism fully transparent." },
          { id:"i2", text:"Implement multi-head attention from scratch", desc:"Splitting into heads, running parallel attention, and concatenating projections is the critical implementation detail that most tutorials skip." },
          { id:"i3", text:"Visualise attention weights on a simple sequence", desc:"Plotting attention weights as a heatmap often shows interpretable patterns — function words attending to content words, pronouns attending to their antecedents." },
          { id:"i4", text:"Add attention to your Week 10 RNN and compare", desc:"The performance improvement on long sequences is usually dramatic and immediate; this is the most compelling demonstration of why attention was invented." },
        ],
        extraReading: [
          { id:"e1", topic:"Sparse attention — Longformer, BigBird for long sequences", desc:"Standard attention is O(n²) in sequence length; sparse attention patterns reduce this to O(n) by attending only to local windows and global tokens.", url:"https://arxiv.org/abs/2004.05150" },
          { id:"e2", topic:"Linear attention — approximating O(n²) with O(n)", desc:"Linear attention uses kernel methods to approximate full attention without materialising the n×n matrix, enabling attention on very long sequences.", url:"https://arxiv.org/abs/2006.16236" },
          { id:"e3", topic:"Relative positional encodings — distance rather than absolute position", desc:"Relative encodings bias attention based on the distance between tokens rather than their absolute positions, which generalises better to longer sequences.", url:"https://arxiv.org/abs/1803.02155" },
          { id:"e4", topic:"Mixture of Experts (MoE) — routing tokens to specialist sub-networks", desc:"MoE replaces dense feed-forward layers with a router that sends each token to a subset of expert networks, dramatically increasing capacity without proportional compute.", url:"https://arxiv.org/abs/2101.03961" },
        ]
      },
      {
        id:"c10", week:"Weeks 12–13", title:"The Transformer", duration:"2 weeks",
        tags:["gpt","bert","architecture"],
        theory: [
          { id:"t1", text:"Positional encoding — injecting sequence order", desc:"Self-attention is permutation-invariant by default — it doesn't know that word 1 comes before word 2; positional encodings add this information explicitly.", resource:"Jay Alammar — Illustrated Transformer" },
          { id:"t2", text:"Residual connections — gradient highways through depth", desc:"Residual connections let gradients flow directly from the output back to early layers, enabling the training of very deep Transformers that would otherwise suffer from vanishing gradients.", resource:"Karpathy — Let's Build GPT" },
          { id:"t3", text:"Layer normalisation — stabilising activation distributions", desc:"LayerNorm normalises across the feature dimension rather than the batch, which is more stable for variable-length sequences and works correctly at batch size 1.", resource:"Karpathy — Let's Build GPT" },
          { id:"t4", text:"Feed-forward sublayer — the MLP between attention layers", desc:"The feed-forward layer applies the same 2-layer MLP to every position independently, giving the network capacity to transform the attended representations.", resource:"Jay Alammar — Illustrated Transformer" },
          { id:"t5", text:"Causal masking — why autoregressive generation needs upper-triangular masks", desc:"During training, we prevent each position from attending to future positions by masking the upper triangle of the attention matrix — this teaches the model to predict the next token only from past context.", resource:"Karpathy — Let's Build GPT" },
          { id:"t6", text:"Tokenisation — BPE and subword splitting", desc:"Tokenising at the subword level (not word or character) balances vocabulary size against sequence length; BPE learns the tokenisation from data to minimise sequence length.", resource:"Harvard NLP — Annotated Transformer" },
          { id:"t7", text:"Encoder-only vs decoder-only vs encoder-decoder", desc:"BERT is encoder-only (good for understanding tasks), GPT is decoder-only (good for generation), and T5 is encoder-decoder (good for seq2seq tasks like translation).", resource:"Jay Alammar — Illustrated Transformer" },
        ],
        resources: [
          { id:"r1", text:"Vaswani et al. — Attention is All You Need (paper)", url:"https://arxiv.org/abs/1706.03762", type:"paper" },
          { id:"r2", text:"Jay Alammar — The Illustrated Transformer (blog)", url:"https://jalammar.github.io/illustrated-transformer/", type:"blog" },
          { id:"r3", text:"Andrej Karpathy — Let's Build GPT (YouTube)", url:"https://www.youtube.com/watch?v=kCc8FmEb1nY", type:"youtube" },
          { id:"r4", text:"Harvard NLP — The Annotated Transformer (blog)", url:"https://nlp.seas.harvard.edu/annotated-transformer/", type:"blog" },
        ],
        implementation: [
          { id:"i1", text:"Build a decoder-only Transformer (GPT-style) from scratch", desc:"Every component — embedding, positional encoding, causal attention, FFN, LayerNorm, output projection — implemented yourself in pure PyTorch." },
          { id:"i2", text:"Implement positional encoding — sinusoidal and learned versions", desc:"Implementing both versions and comparing their behaviour gives you intuition for why positional encodings were designed the way they were." },
          { id:"i3", text:"Train on small text dataset — verify coherent generation", desc:"If your implementation is correct, the model should generate increasingly coherent text as training progresses; loss divergence usually means a bug in causal masking." },
          { id:"i4", text:"Implement causal masking from scratch", desc:"The upper-triangular mask is simple to code but critical to get right; implementing it manually ensures you understand why autoregressive generation works." },
          { id:"i5", text:"Study Karpathy's nanoGPT after building your own", desc:"Comparing your implementation to nanoGPT reveals the engineering decisions you made differently and teaches you professional-quality architectural code." },
        ],
        extraReading: [
          { id:"e1", topic:"RoPE — rotary positional embeddings via complex number rotation", desc:"RoPE encodes relative positions by rotating query and key vectors in complex space; it generalises better to longer sequences than learned absolute positions.", url:"https://arxiv.org/abs/2104.09864" },
          { id:"e2", topic:"KV cache — essential for efficient autoregressive inference", desc:"Without KV cache, each new token requires recomputing attention for the entire context; caching key and value tensors reduces this to O(1) per token.", url:"https://medium.com/@plienhar/llm-inference-series-3-kv-caching-unveiled-048152e461c8" },
          { id:"e3", topic:"Speculative decoding — small draft model + large verifier", desc:"A small fast model generates candidate tokens, and the large model verifies them in parallel — often achieving 2-3x throughput improvement.", url:"https://arxiv.org/abs/2211.17192" },
          { id:"e4", topic:"Chinchilla scaling laws — optimal compute allocation", desc:"The Chinchilla paper showed that most LLMs are undertrained relative to model size; the optimal ratio is roughly 20 training tokens per parameter.", url:"https://arxiv.org/abs/2203.15556" },
          { id:"e5", topic:"Pre-norm vs post-norm — training stability difference", desc:"Modern Transformers use pre-norm (LayerNorm before attention) rather than the original post-norm; this makes training more stable and allows higher learning rates.", url:"https://arxiv.org/abs/2002.04745" },
        ]
      },
    ]
  },
  {
    phase: "GenAI Engineer Prep — Marvell",
    color: "#0ea877",
    items: [
      {
        id:"g1", week:"Prep Week 1", title:"LLMs in Production: The Mental Model", duration:"1 week",
        tags:["llm","rag","prompting"],
        theory: [
          { id:"t1", text:"Full LLM stack — model → inference server → API → app → observability", desc:"Understanding which layer each problem lives in is the first step to being effective; most production issues happen at the API or application layer, not the model.", resource:"Chip Huyen — LLM Engineering" },
          { id:"t2", text:"Tokens and context windows — cost and latency implications", desc:"Every token costs money and adds latency; understanding tokenisation is the foundation of LLM cost optimisation and context management.", resource:"Karpathy — Intro to LLMs" },
          { id:"t3", text:"Prompt engineering — system prompts, few-shot, chain-of-thought", desc:"These three techniques account for the majority of performance improvements you can get without changing the model; mastering them is essential for any production LLM system.", resource:"Prompt Engineering Guide" },
          { id:"t4", text:"RAG — retrieval-augmented generation, the problem it solves", desc:"LLMs have a knowledge cutoff and can't access proprietary data; RAG retrieves relevant context at inference time and adds it to the prompt, solving both problems.", resource:"Chip Huyen — LLM Engineering" },
          { id:"t5", text:"Base vs instruction-tuned vs fine-tuned — when to use each", desc:"Base models predict next tokens, instruction-tuned models follow instructions, fine-tuned models specialise in a domain; knowing which to use determines your approach.", resource:"Karpathy — Intro to LLMs" },
        ],
        resources: [
          { id:"r1", text:"Andrej Karpathy — Intro to LLMs (YouTube)", url:"https://www.youtube.com/watch?v=zjkBMFhNj_g", type:"youtube" },
          { id:"r2", text:"Chip Huyen — LLM Engineering in Production (blog)", url:"https://huyenchip.com/2023/04/11/llm-engineering.html", type:"blog" },
          { id:"r3", text:"Prompt Engineering Guide (docs)", url:"https://www.promptingguide.ai/", type:"docs" },
        ],
        implementation: [
          { id:"i1", text:"Call OpenAI/Anthropic API — build chat with system prompts", desc:"Getting your first API call working and experimenting with system prompts is the fastest way to develop production intuition." },
          { id:"i2", text:"Implement chain-of-thought prompting — compare to direct", desc:"Asking the model to think step by step dramatically improves performance on reasoning tasks; experiencing this difference makes the technique memorable." },
          { id:"i3", text:"Build a minimal RAG pipeline — chunk, embed, retrieve", desc:"A simple RAG pipeline in ~50 lines shows you the core mechanics; every production RAG system is an elaboration of this." },
          { id:"i4", text:"Experiment with few-shot examples — observe quality change", desc:"Adding 3-5 examples to your prompt and comparing outputs quantifies the improvement and builds intuition for when few-shot is worth the token cost." },
        ],
        extraReading: [
          { id:"e1", topic:"Constitutional AI and RLHF — how instruction-following is trained", desc:"Understanding how Anthropic's Constitutional AI and OpenAI's RLHF approach train instruction-following gives you insight into model behaviour and its limits.", url:"https://arxiv.org/abs/2212.08073" },
          { id:"e2", topic:"Prompt injection and prompt leaking — security considerations", desc:"System prompts can be extracted or overridden by malicious user inputs; this is a real production security concern for any deployed LLM application.", url:"https://simonwillison.net/2022/Sep/12/prompt-injection/" },
          { id:"e3", topic:"Structured outputs / JSON mode — reliable parseable responses", desc:"Getting LLMs to produce consistent JSON rather than free text is critical for any application that needs to parse the output programmatically.", url:"https://docs.anthropic.com/en/docs/test-and-evaluate/strengthen-guardrails/increase-consistency" },
          { id:"e4", topic:"Emergent capabilities — what abilities appear with scale", desc:"Certain abilities like chain-of-thought reasoning emerge abruptly at scale thresholds; understanding this shapes how you reason about what a model can and can't do.", url:"https://arxiv.org/abs/2206.07682" },
        ]
      },
      {
        id:"g2", week:"Prep Week 2", title:"Agents: Architecture & Frameworks", duration:"1 week",
        tags:["agents","langchain","langgraph","tools"],
        theory: [
          { id:"t1", text:"ReAct framework — Reasoning + Acting, the foundational agent loop", desc:"ReAct alternates between generating reasoning traces and taking actions; this simple pattern is the foundation of every production agent you'll encounter.", resource:"Original ReAct Paper" },
          { id:"t2", text:"Tool use / function calling — how LLMs invoke external APIs", desc:"Function calling lets LLMs specify structured API calls which are executed by your code and returned as results; this is the bridge between LLMs and the real world.", resource:"LangChain Docs — Agents" },
          { id:"t3", text:"Memory types — in-context, external vector DB, episodic", desc:"In-context memory is limited by the context window; external memory in a vector DB persists across sessions; understanding when to use each is a key production design decision.", resource:"Lilian Weng — LLM Agents" },
          { id:"t4", text:"Agentic failure modes — hallucination, loops, context overflow", desc:"Agents fail in characteristic ways that you need to anticipate; hallucinated tool calls, infinite planning loops, and context window overflow are the most common production failures.", resource:"Andrew Ng — Agentic Design Patterns" },
          { id:"t5", text:"Multi-agent systems — orchestrators and subagents", desc:"Complex tasks benefit from specialised agents that hand off work to each other; understanding orchestration patterns is essential for building agents beyond toy demos.", resource:"LangGraph Docs" },
        ],
        resources: [
          { id:"r1", text:"Original ReAct Paper — Yao et al. 2022 (paper)", url:"https://arxiv.org/abs/2210.03629", type:"paper" },
          { id:"r2", text:"LangChain Docs — Agents (docs)", url:"https://python.langchain.com/docs/modules/agents/", type:"docs" },
          { id:"r3", text:"Andrew Ng — AI Agentic Design Patterns (YouTube)", url:"https://www.youtube.com/watch?v=sal78ACtGTc", type:"youtube" },
          { id:"r4", text:"LangGraph Docs (docs)", url:"https://langchain-ai.github.io/langgraph/", type:"docs" },
          { id:"r5", text:"Lilian Weng — LLM-Powered Autonomous Agents (blog)", url:"https://lilianweng.github.io/posts/2023-06-23-agent/", type:"blog" },
        ],
        implementation: [
          { id:"i1", text:"Build a ReAct agent from scratch with 2-3 custom tools", desc:"Writing the agent loop yourself — parse reasoning, execute tool, feed result back — demystifies what LangChain is actually doing under the hood." },
          { id:"i2", text:"Implement the same agent in LangChain — compare abstraction", desc:"After building it manually, LangChain's abstractions will make complete sense rather than feeling like magic." },
          { id:"i3", text:"Build a stateful multi-step agent with LangGraph", desc:"LangGraph's graph-based state machine handles complex agent workflows that linear chains can't express; building one teaches you production-grade agent architecture." },
          { id:"i4", text:"Intentionally cause and debug each failure mode", desc:"Deliberately triggering hallucination, infinite loops, and context overflow makes you prepared to recognise and fix these in production." },
        ],
        extraReading: [
          { id:"e1", topic:"Tree of Thoughts — exploring multiple reasoning paths", desc:"ToT extends chain-of-thought by having the LLM generate and evaluate multiple reasoning branches before committing, improving performance on complex planning tasks.", url:"https://arxiv.org/abs/2305.10601" },
          { id:"e2", topic:"Agent memory architectures — episodic, semantic, procedural", desc:"Different types of memory serve different purposes in agents; understanding the taxonomy helps you design memory systems that actually improve agent performance.", url:"https://lilianweng.github.io/posts/2023-06-23-agent/" },
          { id:"e3", topic:"Sandboxing LLM-generated code — safe execution environments", desc:"Agents that write and execute code need secure sandboxing; understanding the threat model and available solutions (E2B, Modal) is essential for production code agents.", url:"https://e2b.dev/blog/sandboxing-llm-generated-code" },
          { id:"e4", topic:"Plan-and-Execute agents — separating planning from execution", desc:"Some tasks benefit from generating a full plan before executing any step; this reduces error propagation and allows plan revision based on intermediate results.", url:"https://blog.langchain.dev/plan-and-execute-agents/" },
        ]
      },
      {
        id:"g3", week:"Prep Week 3", title:"Evaluation, Observability & RAG Deep Dive", duration:"1 week",
        tags:["eval","ragas","vector db","langsmith"],
        theory: [
          { id:"t1", text:"Why LLM eval is fundamentally different from traditional ML eval", desc:"There's no single ground-truth label for most LLM tasks; evaluation requires either human judgment or LLM-as-judge, both of which have their own biases.", resource:"Ragas Docs" },
          { id:"t2", text:"LLM-as-judge — using a stronger model to evaluate outputs", desc:"Having GPT-4 grade the outputs of a smaller model is increasingly standard in production evaluation pipelines; understanding its limitations prevents false confidence.", resource:"Ragas Docs" },
          { id:"t3", text:"RAG metrics — faithfulness, answer relevance, context recall", desc:"Faithfulness checks if the answer is grounded in the retrieved context; answer relevance checks if it answers the question; together they diagnose most RAG failure modes.", resource:"Ragas Docs" },
          { id:"t4", text:"Vector databases — similarity search, FAISS, Pinecone, Weaviate", desc:"Vector DBs store embedding vectors and enable fast approximate nearest-neighbour search; understanding indexing strategies (HNSW, IVF) determines the speed/accuracy tradeoff.", resource:"Pinecone — What is a Vector DB" },
          { id:"t5", text:"Chunking strategies — why document splitting matters enormously", desc:"The wrong chunk size means retrieved context either lacks needed information or includes too much noise; chunking strategy is often the highest-leverage tuning decision in a RAG system.", resource:"Jerry Liu — Advanced RAG" },
          { id:"t6", text:"Advanced RAG — hybrid search, reranking, HyDE, query expansion", desc:"These techniques address the core limitations of naive RAG: hybrid search adds keyword matching, reranking improves relevance, HyDE handles poorly-phrased queries.", resource:"Jerry Liu — Advanced RAG" },
        ],
        resources: [
          { id:"r1", text:"Ragas Documentation (docs)", url:"https://docs.ragas.io/", type:"docs" },
          { id:"r2", text:"LangSmith Docs — tracing and evaluation (docs)", url:"https://docs.smith.langchain.com/", type:"docs" },
          { id:"r3", text:"Jerry Liu — Advanced RAG Techniques (blog)", url:"https://www.llamaindex.ai/blog/a-cheat-sheet-and-some-recipes-for-building-advanced-rag-rag-cheat-sheet-96de63c09de7", type:"blog" },
          { id:"r4", text:"Pinecone — What is a Vector Database (blog)", url:"https://www.pinecone.io/learn/vector-database/", type:"blog" },
        ],
        implementation: [
          { id:"i1", text:"Build a full RAG pipeline with LlamaIndex + a vector DB", desc:"End-to-end: ingest documents, chunk them, embed them, store in a vector DB, retrieve for queries, and generate answers — the complete production RAG loop." },
          { id:"i2", text:"Evaluate with Ragas — measure faithfulness and answer relevance", desc:"Running Ragas on your RAG pipeline gives you quantified metrics rather than vibes; this is the foundation of principled RAG improvement." },
          { id:"i3", text:"Set up LangSmith tracing — trace an agent run and debug a failure", desc:"Seeing the full trace of an agent run (every LLM call, every tool call, every intermediate state) is the most powerful debugging tool you'll have in production." },
          { id:"i4", text:"Implement hybrid search — compare to pure semantic", desc:"Adding BM25 keyword search alongside vector search typically improves retrieval for queries with specific entities, product names, or technical terms." },
          { id:"i5", text:"Experiment with chunking strategies on the same document", desc:"Running the same queries over a document chunked by sentence, paragraph, and fixed tokens — and comparing retrieval quality — makes chunking strategy concrete." },
        ],
        extraReading: [
          { id:"e1", topic:"HNSW — the indexing algorithm behind most vector DBs", desc:"Hierarchical Navigable Small World graphs enable approximate nearest-neighbour search in sub-linear time; understanding how it works demystifies vector DB performance characteristics.", url:"https://www.pinecone.io/learn/series/faiss/hnsw/" },
          { id:"e2", topic:"Evals as a product — running eval pipelines in CI/CD", desc:"Production ML teams treat evaluations like tests in software engineering; running evals automatically on every model change prevents regressions.", url:"https://hamel.dev/blog/posts/evals/" },
          { id:"e3", topic:"Multi-hop reasoning in RAG — combining multiple retrieved chunks", desc:"Some questions require synthesising information from multiple documents that each contain partial answers; this is one of the hardest unsolved problems in RAG.", url:"https://arxiv.org/abs/2212.10560" },
          { id:"e4", topic:"Embedding model selection — domain-specific vs general-purpose", desc:"General-purpose embedding models (OpenAI ada, BGE) work well for most domains, but specialised domains like biomedical or legal often benefit from domain-specific models.", url:"https://huggingface.co/blog/mteb" },
        ]
      },
      {
        id:"g4", week:"Prep Week 4", title:"Deployment, MLOps & Production Mindset", duration:"1 week",
        tags:["vllm","docker","guardrails","llmops"],
        theory: [
          { id:"t1", text:"Inference servers — vLLM, TGI, how LLMs are served efficiently", desc:"vLLM's PagedAttention and continuous batching are the key innovations that make serving LLMs economical; knowing how they work helps you configure and debug inference infrastructure.", resource:"vLLM Docs" },
          { id:"t2", text:"Quantisation — INT8/INT4, running large models on less hardware", desc:"Quantisation reduces model weights from 16-bit floats to lower precision, typically cutting memory requirements by 4x with minimal accuracy loss.", resource:"Full Stack LLM Bootcamp" },
          { id:"t3", text:"Prompt versioning — treating prompts like code", desc:"A prompt change is equivalent to a code change and deserves the same version control, testing, and review process; most teams that skip this regret it.", resource:"Full Stack LLM Bootcamp" },
          { id:"t4", text:"Guardrails — safety and topic control for production systems", desc:"Guardrails are programmatic filters that prevent the model from producing harmful, off-topic, or policy-violating outputs; they're non-optional in any production deployment.", resource:"NeMo Guardrails" },
          { id:"t5", text:"LoRA — fine-tuning via low-rank adapters", desc:"LoRA adds small trainable rank-decomposition matrices to frozen model weights, allowing fine-tuning with ~1% of the original parameters — making fine-tuning accessible on consumer hardware.", resource:"Full Stack LLM Bootcamp" },
          { id:"t6", text:"Cost management — tokens are money, optimisation strategies", desc:"In production, token cost is often the dominant operational expense; understanding caching, prompt compression, and model routing can reduce costs by 50-90%.", resource:"Chip Huyen — Designing ML Systems" },
        ],
        resources: [
          { id:"r1", text:"vLLM Documentation (docs)", url:"https://docs.vllm.ai/en/latest/", type:"docs" },
          { id:"r2", text:"Full Stack LLM Bootcamp, free (blog/video series)", url:"https://fullstackdeeplearning.com/llm-bootcamp/", type:"youtube" },
          { id:"r3", text:"NeMo Guardrails — NVIDIA (docs)", url:"https://github.com/NVIDIA/NeMo-Guardrails", type:"docs" },
          { id:"r4", text:"Chip Huyen — Designing ML Systems (book, O'Reilly)", url:"https://www.oreilly.com/library/view/designing-machine-learning/9781098107963/", type:"docs" },
        ],
        implementation: [
          { id:"i1", text:"Serve a small open-source model locally with vLLM", desc:"Getting vLLM running on your machine and sending API-compatible requests shows you exactly what production inference infrastructure looks like." },
          { id:"i2", text:"Add guardrails to your Week 2 agent", desc:"Implementing both input and output guardrails on a real agent reveals the engineering tradeoffs between safety and latency." },
          { id:"i3", text:"Fine-tune a small model with LoRA using HuggingFace PEFT", desc:"Fine-tuning a 7B model with LoRA on a consumer GPU shows you that fine-tuning is accessible and demystifies the process." },
          { id:"i4", text:"Build a cost tracker — log token usage and cost per query", desc:"Adding cost tracking to your agent reveals which operations are expensive and gives you data for optimisation decisions." },
          { id:"i5", text:"Containerise your agent app with Docker", desc:"Packaging your application in a Docker container is the first step toward reproducible, deployable production systems." },
        ],
        extraReading: [
          { id:"e1", topic:"PagedAttention — why vLLM is faster than naive serving", desc:"vLLM manages KV cache memory like virtual memory in an OS, eliminating the memory fragmentation that makes naive LLM serving inefficient.", url:"https://vllm.ai/blog/2023/06/20/vllm.html" },
          { id:"e2", topic:"Continuous batching vs static batching for LLM throughput", desc:"Static batching wastes GPU compute waiting for the longest sequence; continuous batching adds new requests as slots free up, dramatically improving throughput.", url:"https://www.anyscale.com/blog/continuous-batching-llm-inference" },
          { id:"e3", topic:"llama.cpp and GGUF — quantised models on CPU", desc:"llama.cpp enables running quantised LLMs on CPU without a GPU; understanding GGUF format and quantisation levels helps you choose the right model for constrained environments.", url:"https://github.com/ggerganov/llama.cpp" },
          { id:"e4", topic:"SLAs for LLM APIs — latency targets in production", desc:"Production LLM services need to define time-to-first-token and tokens-per-second SLAs; understanding what's achievable at different scales informs infrastructure decisions.", url:"https://www.anyscale.com/blog/llm-performance-benchmarks" },
        ]
      },
    ]
  },
  {
    phase: "Road Ahead",
    color: "#9333ea",
    items: [
      {
        id:"ra1", week:"Months 4–6", title:"Modern Architectures (BERT, GPT, ViT, Diffusion)", duration:"3 months",
        tags:["research","architectures"],
        theory:[
          { id:"t1", text:"BERT — bidirectional attention, masked language modelling", desc:"BERT's key innovation is bidirectional context; by masking tokens and predicting them from both directions, it learns richer representations than unidirectional models.", resource:"Jay Alammar — Illustrated BERT" },
          { id:"t2", text:"GPT series — autoregressive LM, emergent capabilities at scale", desc:"Each GPT version demonstrated that scaling parameters and data produces emergent capabilities that weren't explicitly trained; understanding this informs how you think about model behaviour.", resource:"BERT Paper" },
          { id:"t3", text:"Vision Transformer (ViT) — patches as tokens", desc:"ViT splits images into fixed-size patches and treats them like word tokens; this showed that Transformers can match or beat CNNs on vision without any inductive biases.", resource:"ViT Paper" },
          { id:"t4", text:"Diffusion models — denoising as generation", desc:"Diffusion models learn to reverse a noise-addition process; at inference, they start from pure noise and iteratively denoise to produce images, audio, or other data.", resource:"ViT Paper" },
        ],
        resources:[
          { id:"r1", text:"BERT Paper — Devlin et al. 2018 (paper)", url:"https://arxiv.org/abs/1810.04805", type:"paper" },
          { id:"r2", text:"ViT Paper — Dosovitskiy et al. 2020 (paper)", url:"https://arxiv.org/abs/2010.11929", type:"paper" },
          { id:"r3", text:"Jay Alammar — Illustrated BERT (blog)", url:"https://jalammar.github.io/illustrated-bert/", type:"blog" },
        ],
        implementation:[
          { id:"i1", text:"Fine-tune BERT on a classification task with HuggingFace Transformers", desc:"HuggingFace makes fine-tuning BERT accessible in ~20 lines; doing it yourself teaches you the fine-tuning workflow you'll use constantly." },
          { id:"i2", text:"Implement a minimal ViT patch embedding from scratch", desc:"The patch embedding layer is the only architecturally novel part of ViT; implementing it clarifies how images become sequences." },
          { id:"i3", text:"Run Stable Diffusion locally and trace the inference code", desc:"Following the denoising loop through the actual code — UNet, VAE, scheduler — demystifies what's happening at inference time." },
        ],
        extraReading:[
          { id:"e1", topic:"Masked autoencoders (MAE) — BERT-style pretraining for vision", desc:"MAE masks 75% of image patches and reconstructs them, learning strong visual representations without labels — a breakthrough in self-supervised vision.", url:"https://arxiv.org/abs/2111.06377" },
          { id:"e2", topic:"CLIP — contrastive learning across vision and language", desc:"CLIP trains an image encoder and text encoder to agree on matching pairs; the resulting representations enable zero-shot classification and power most modern image-text systems.", url:"https://arxiv.org/abs/2103.00020" },
          { id:"e3", topic:"DINO / DINOv2 — self-supervised vision without labels", desc:"DINO's self-distillation produces visual features with emergent segmentation properties, showing that strong vision representations can be learned without any human labels.", url:"https://arxiv.org/abs/2304.07193" },
        ]
      },
      {
        id:"ra2", week:"Months 6–9", title:"LLMs Deep Dive (RLHF, LoRA, Flash Attention)", duration:"3 months",
        tags:["alignment","fine-tuning"],
        theory:[
          { id:"t1", text:"RLHF — reward modelling and PPO for alignment", desc:"RLHF trains a reward model from human preferences, then uses PPO to fine-tune the LLM to maximise that reward; this is how ChatGPT was made to follow instructions helpfully.", resource:"InstructGPT Paper" },
          { id:"t2", text:"DPO — direct preference optimisation without RL", desc:"DPO achieves RLHF-like alignment by directly optimising a contrastive objective on preferred/rejected response pairs, eliminating the need for a separate reward model or RL training.", resource:"InstructGPT Paper" },
          { id:"t3", text:"Flash Attention — IO-aware attention without materialising NxN matrix", desc:"Flash Attention reorders attention computation to minimise HBM reads/writes, achieving 2-4x speedup and making longer context windows feasible.", resource:"Flash Attention Paper" },
          { id:"t4", text:"Chinchilla scaling laws — optimal compute allocation", desc:"The Chinchilla paper overturned prior scaling wisdom by showing that compute-optimal training requires far more data relative to model size than previously used.", resource:"Flash Attention Paper" },
        ],
        resources:[
          { id:"r1", text:"InstructGPT Paper — Ouyang et al. 2022 (paper)", url:"https://arxiv.org/abs/2203.02155", type:"paper" },
          { id:"r2", text:"Flash Attention Paper — Dao et al. 2022 (paper)", url:"https://arxiv.org/abs/2205.14135", type:"paper" },
          { id:"r3", text:"LoRA Paper — Hu et al. 2021 (paper)", url:"https://arxiv.org/abs/2106.09685", type:"paper" },
        ],
        implementation:[
          { id:"i1", text:"Fine-tune LLaMA or Mistral with LoRA using HuggingFace PEFT", desc:"Fine-tuning a 7B parameter model in under an hour on a single GPU demonstrates that the barrier to specialised models is now low." },
          { id:"i2", text:"Run DPO fine-tuning on a small preference dataset", desc:"Implementing DPO gives you a hands-on understanding of preference learning without the complexity of PPO." },
          { id:"i3", text:"Benchmark Flash Attention vs standard attention — measure speedup", desc:"Measuring the actual wall-clock speedup on different sequence lengths makes the IO-awareness argument concrete." },
        ],
        extraReading:[
          { id:"e1", topic:"Reward hacking and Goodhart's Law in RLHF", desc:"Optimising a learned reward model too aggressively causes the model to find outputs that score highly on the reward model but are not actually preferred by humans.", url:"https://arxiv.org/abs/2209.13345" },
          { id:"e2", topic:"Constitutional AI — using AI feedback instead of human labelling", desc:"Anthropic's Constitutional AI approach uses the model itself to critique and revise its own outputs, reducing the need for expensive human feedback.", url:"https://arxiv.org/abs/2212.08073" },
          { id:"e3", topic:"Mixture of Experts architecture — Mistral MoE, GPT-4 speculation", desc:"MoE replaces dense FFN layers with a router that activates only a subset of expert networks per token, dramatically increasing model capacity without proportional compute costs.", url:"https://arxiv.org/abs/2401.04088" },
        ]
      },
      {
        id:"ra3", week:"Month 9+", title:"Specialisation & Research", duration:"ongoing",
        tags:["research","agents","multimodal"],
        theory:[
          { id:"t1", text:"Pick your lane — research, applied, multimodal, or agents", desc:"Depth beats breadth at this stage; picking one direction and going deep for 6 months will put you in the top 5% of practitioners in that area." },
          { id:"t2", text:"Read papers weekly — trace lineage with Connected Papers", desc:"Reading one paper per week and tracing its connections builds the mental map of the field that separates people who follow the frontier from people who shape it." },
          { id:"t3", text:"Contribute to open-source — HuggingFace, LangChain, others", desc:"Open-source contributions build your reputation, force you to write production-quality code, and put you in contact with the best practitioners in the field." },
        ],
        resources:[
          { id:"r1", text:"Semantic Scholar (research discovery)", url:"https://www.semanticscholar.org/", type:"docs" },
          { id:"r2", text:"Connected Papers (paper lineage visualisation)", url:"https://www.connectedpapers.com/", type:"docs" },
          { id:"r3", text:"Arxiv Sanity Preserver (paper filtering)", url:"https://arxiv-sanity-lite.com/", type:"docs" },
        ],
        implementation:[
          { id:"i1", text:"Start a self-directed project with a real dataset and real problem", desc:"A project driven by genuine curiosity — not a tutorial — is where intuition forms fastest; the struggle is the curriculum." },
          { id:"i2", text:"Write up your findings — GitHub README or blog post", desc:"Writing forces you to understand what you actually learned; the act of explaining it reveals gaps you didn't know you had." },
        ],
        extraReading:[
          { id:"e1", topic:"How to read a research paper efficiently", desc:"Most people read papers wrong — understanding how to skim for contribution before reading deeply saves enormous time over a research career.", url:"https://web.stanford.edu/class/ee384m/Handouts/HowtoReadPaper.pdf" },
          { id:"e2", topic:"Open problems in interpretability and mechanistic understanding", desc:"Interpretability research tries to understand what computations actually happen inside LLMs; it's one of the most intellectually rich areas in AI and entirely open.", url:"https://transformer-circuits.pub/" },
        ]
      },
    ]
  }
];

const STATUS = {
  not_started: { bg:"#1c2128", border:"#30363d", icon:"○", color:C.dim },
  in_progress: { bg:"#2d2208", border:"#9e6a03", icon:"◑", color:C.yellow },
  done: { bg:"#0d1f0f", border:"#238636", icon:"●", color:C.green },
};

const TYPE_BADGE = {
  youtube: { label:"▶ YouTube", bg:"#3d1212", color:"#f85149" },
  blog: { label:"✍ Blog", bg:"#0d1f2d", color:"#58a6ff" },
  docs: { label:"📄 Docs", bg:"#1a1f2e", color:"#a5d6ff" },
  paper: { label:"📝 Paper", bg:"#2d1b3d", color:"#d2a8ff" },
};

const ALL_ITEMS = ROADMAP.flatMap(p => p.items);

function CheckRow({ checked, onChange, label, desc, resource, isLink, url, type }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ marginBottom:6 }}>
      <div style={{ display:"flex", alignItems:"flex-start", gap:8, cursor:"pointer" }} onClick={() => setOpen(o=>!o)}>
        <div onClick={e=>{e.stopPropagation(); onChange();}} style={{ flexShrink:0, width:16, height:16, borderRadius:3, marginTop:3, border:`1.5px solid ${checked?"#238636":C.border}`, background:checked?"#238636":"transparent", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.15s" }}>
          {checked && <span style={{ color:"#fff", fontSize:10, fontWeight:800, lineHeight:1 }}>✓</span>}
        </div>
        <div style={{ flex:1 }}>
          <div style={{ display:"flex", alignItems:"center", gap:6, flexWrap:"wrap" }}>
            {isLink && url ? (
              <a href={url} target="_blank" rel="noreferrer" onClick={e=>e.stopPropagation()} style={{ fontSize:13, color:checked?C.dim:C.accent, textDecoration:checked?"line-through":"underline", lineHeight:1.4 }}>{label}</a>
            ) : (
              <span style={{ fontSize:13, color:checked?C.dim:C.text, textDecoration:checked?"line-through":"none", lineHeight:1.4 }}>{label}</span>
            )}
            {resource && !isLink && <span style={{ fontSize:10, color:C.dim, background:C.elevated, padding:"1px 6px", borderRadius:99, flexShrink:0 }}>{resource}</span>}
            {isLink && type && TYPE_BADGE[type] && <span style={{ fontSize:10, padding:"1px 6px", borderRadius:99, background:TYPE_BADGE[type].bg, color:TYPE_BADGE[type].color, flexShrink:0 }}>{TYPE_BADGE[type].label}</span>}
            {desc && <span style={{ fontSize:10, color:C.dim, marginLeft:"auto" }}>{open?"▲":"▼"}</span>}
          </div>
        </div>
      </div>
      {open && desc && (
        <div style={{ marginLeft:24, marginTop:5, marginBottom:2, fontSize:12, color:C.muted, lineHeight:1.6, background:C.bg, borderLeft:`2px solid ${C.border}`, paddingLeft:10, paddingTop:4, paddingBottom:4, borderRadius:"0 4px 4px 0" }}>
          {desc}
        </div>
      )}
    </div>
  );
}

function ExtraItem({ item, checked, onChange }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ marginBottom:7 }}>
      <div style={{ display:"flex", alignItems:"flex-start", gap:8, cursor:"pointer" }} onClick={() => setOpen(o=>!o)}>
        <div onClick={e=>{e.stopPropagation(); onChange();}} style={{ flexShrink:0, width:16, height:16, borderRadius:3, marginTop:3, border:`1.5px solid ${checked?"#9333ea":"#30363d"}`, background:checked?"#9333ea":"transparent", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
          {checked && <span style={{ color:"#fff", fontSize:10, fontWeight:800, lineHeight:1 }}>✓</span>}
        </div>
        <div style={{ flex:1 }}>
          <div style={{ display:"flex", alignItems:"center", gap:6, flexWrap:"wrap" }}>
            <span style={{ fontSize:13, color:checked?C.dim:"#c9a5ff", textDecoration:checked?"line-through":"none" }}>{item.topic}</span>
            {item.url && (
              <a href={item.url} target="_blank" rel="noreferrer" onClick={e=>e.stopPropagation()} style={{ fontSize:10, color:"#a371f7", textDecoration:"underline" }}>↗ read</a>
            )}
            <span style={{ fontSize:10, color:C.dim, marginLeft:"auto" }}>{open?"▲":"▼"}</span>
          </div>
        </div>
      </div>
      {open && item.desc && (
        <div style={{ marginLeft:24, marginTop:5, fontSize:12, color:C.muted, lineHeight:1.6, background:C.bg, borderLeft:`2px solid #5a2d9a`, paddingLeft:10, paddingTop:4, paddingBottom:4, borderRadius:"0 4px 4px 0" }}>
          {item.desc}
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [progress, setProgress] = useState({});
  const [checks, setChecks] = useState({});
  const [notes, setNotes] = useState({});
  const [expanded, setExpanded] = useState({});
  const [expandedPhases, setExpandedPhases] = useState(Object.fromEntries(ROADMAP.map(p=>[p.phase,true])));
  const [activeNote, setActiveNote] = useState(null);
  const [noteText, setNoteText] = useState("");
  const [view, setView] = useState("roadmap");
  const [activeSection, setActiveSection] = useState({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const p = await store.get("p"); const c = await store.get("c"); const n = await store.get("n");
        if (p) setProgress(JSON.parse(p.value));
        if (c) setChecks(JSON.parse(c.value));
        if (n) setNotes(JSON.parse(n.value));
      } catch {}
      setLoaded(true);
    })();
  }, []);

  const persist = async (np,nc,nn) => {
    try { await store.set("p",JSON.stringify(np)); await store.set("c",JSON.stringify(nc)); await store.set("n",JSON.stringify(nn)); } catch {}
  };

  const cycleStatus = async (id,e) => {
    e.stopPropagation();
    const cur = progress[id]||"not_started";
    const next = cur==="not_started"?"in_progress":cur==="in_progress"?"done":"not_started";
    const np = {...progress,[id]:next}; setProgress(np); await persist(np,checks,notes);
  };

  const toggleCheck = async (itemId,sec,checkId) => {
    const key = `${itemId}__${sec}__${checkId}`;
    const nc = {...checks,[key]:!checks[key]}; setChecks(nc); await persist(progress,nc,notes);
  };

  const saveNote = async () => {
    const nn = {...notes,[activeNote]:noteText}; setNotes(nn); await persist(progress,checks,nn);
    setActiveNote(null); setNoteText("");
  };

  const toggleItem = (id) => setExpanded(e=>({...e,[id]:!e[id]}));
  const togglePhase = (phase) => setExpandedPhases(p=>({...p,[phase]:!p[phase]}));
  const setSection = (id,sec) => setActiveSection(a=>({...a,[id]:a[id]===sec?null:sec}));

  const done = ALL_ITEMS.filter(i=>progress[i.id]==="done").length;
  const inProg = ALL_ITEMS.filter(i=>progress[i.id]==="in_progress").length;
  const total = ALL_ITEMS.length;
  const pct = Math.round((done/total)*100);
  const getC = (item,sec) => { const arr=item[sec]||[]; return {checked:arr.filter(c=>checks[`${item.id}__${sec}__${c.id}`]).length,total:arr.length}; };

  if (!loaded) return <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",background:C.bg,color:C.muted,fontFamily:"monospace"}}>Loading...</div>;

  return (
    <div style={{fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif",background:C.bg,height:"100vh",color:C.text,display:"flex",overflow:"hidden"}}>

      {/* ── Sidebar ── */}
      <div style={{width:270,flexShrink:0,borderRight:`1px solid ${C.border}`,background:C.surface,height:"100vh",overflowY:"auto",display:"flex",flexDirection:"column",padding:"24px 18px"}}>

        <div style={{marginBottom:26}}>
          <div style={{fontSize:17,fontWeight:800,color:C.text,letterSpacing:-0.4}}>ML/AI Mastery</div>
          <div style={{fontSize:11,color:C.dim,marginTop:3,lineHeight:1.4}}>Basics → Cracked → Marvell Ready</div>
        </div>

        <div style={{marginBottom:24,padding:"14px",background:C.elevated,borderRadius:10,border:`1px solid ${C.border}`}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:7}}>
            <span style={{fontSize:10,color:C.dim,fontWeight:700,textTransform:"uppercase",letterSpacing:0.6}}>Progress</span>
            <span style={{fontSize:14,fontWeight:800,color:C.text}}>{pct}%</span>
          </div>
          <div style={{background:C.bg,borderRadius:99,height:5,marginBottom:9}}>
            <div style={{background:`linear-gradient(90deg,${C.accent},#39d353)`,width:`${pct}%`,height:"100%",borderRadius:99,transition:"width 0.5s"}}/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:2}}>
            <div style={{textAlign:"center",padding:"6px 4px",background:C.bg,borderRadius:6}}>
              <div style={{fontSize:16,fontWeight:800,color:C.green}}>{done}</div>
              <div style={{fontSize:9,color:C.dim,marginTop:1}}>Done</div>
            </div>
            <div style={{textAlign:"center",padding:"6px 4px",background:C.bg,borderRadius:6}}>
              <div style={{fontSize:16,fontWeight:800,color:C.yellow}}>{inProg}</div>
              <div style={{fontSize:9,color:C.dim,marginTop:1}}>Active</div>
            </div>
            <div style={{textAlign:"center",padding:"6px 4px",background:C.bg,borderRadius:6}}>
              <div style={{fontSize:16,fontWeight:800,color:C.muted}}>{total-done-inProg}</div>
              <div style={{fontSize:9,color:C.dim,marginTop:1}}>Left</div>
            </div>
          </div>
        </div>

        <div style={{marginBottom:20}}>
          <div style={{fontSize:10,color:C.dim,fontWeight:700,textTransform:"uppercase",letterSpacing:0.7,marginBottom:6,paddingLeft:2}}>Views</div>
          {[["roadmap","📋  Roadmap"],["stats","📊  Stats"]].map(([v,l])=>(
            <button key={v} onClick={()=>setView(v)} style={{width:"100%",display:"flex",alignItems:"center",padding:"8px 10px",borderRadius:7,border:"none",cursor:"pointer",fontSize:13,fontWeight:600,background:view===v?"#0d1f42":"transparent",color:view===v?C.accent:C.muted,textAlign:"left",marginBottom:2,transition:"all 0.15s"}}>{l}</button>
          ))}
        </div>

        <div style={{flex:1}}>
          <div style={{fontSize:10,color:C.dim,fontWeight:700,textTransform:"uppercase",letterSpacing:0.7,marginBottom:10,paddingLeft:2}}>Phases</div>
          {ROADMAP.map(phase=>{
            const phDone=phase.items.filter(i=>progress[i.id]==="done").length;
            const phPct=Math.round((phDone/phase.items.length)*100);
            return (
              <div key={phase.phase} style={{marginBottom:16,paddingLeft:2}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:5}}>
                  <div style={{display:"flex",alignItems:"center",gap:7,minWidth:0}}>
                    <div style={{width:7,height:7,borderRadius:"50%",background:phase.color,flexShrink:0}}/>
                    <span style={{fontSize:11,fontWeight:600,color:C.muted,lineHeight:1.3,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{phase.phase}</span>
                  </div>
                  <span style={{fontSize:10,color:C.dim,flexShrink:0,marginLeft:4}}>{phDone}/{phase.items.length}</span>
                </div>
                <div style={{background:C.elevated,borderRadius:99,height:3,marginLeft:14}}>
                  <div style={{background:phase.color,width:`${phPct}%`,height:"100%",borderRadius:99,transition:"width 0.4s",opacity:0.75}}/>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{paddingTop:16,borderTop:`1px solid ${C.border}`}}>
          <button onClick={async()=>{
            if(!confirm("Reset all progress, checks, and notes?")) return;
            setProgress({}); setChecks({}); setNotes({});
            try{await store.set("p","{}"); await store.set("c","{}"); await store.set("n","{}");} catch{}
          }} style={{fontSize:11,color:C.dim,background:"transparent",border:`1px solid ${C.border}`,borderRadius:6,padding:"6px 10px",cursor:"pointer",width:"100%"}}>Reset Everything</button>
        </div>
      </div>

      {/* ── Main scrollable area ── */}
      <div style={{flex:1,overflowY:"auto",height:"100vh"}}>
      <div style={{maxWidth:860,margin:"0 auto",padding:"24px 32px"}}>

        {view==="roadmap" && ROADMAP.map(phase=>{
          const phDone = phase.items.filter(i=>progress[i.id]==="done").length;
          const phOpen = expandedPhases[phase.phase];
          return (
            <div key={phase.phase} style={{marginBottom:10,border:`1px solid ${C.border}`,borderRadius:10,overflow:"hidden"}}>
              <div onClick={()=>togglePhase(phase.phase)} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 16px",background:C.surface,cursor:"pointer",borderBottom:phOpen?`1px solid ${C.border}`:"none"}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <div style={{width:8,height:8,borderRadius:"50%",background:phase.color}}/>
                  <span style={{fontWeight:700,fontSize:17,color:C.text}}>{phase.phase}</span>
                  <span style={{fontSize:13,color:C.dim,background:C.elevated,padding:"2px 8px",borderRadius:99}}>{phDone}/{phase.items.length}</span>
                </div>
                <span style={{color:C.dim,fontSize:11}}>{phOpen?"▲":"▼"}</span>
              </div>

              {phOpen && phase.items.map((item,idx)=>{
                const status = progress[item.id]||"not_started";
                const st = STATUS[status];
                const isOpen = expanded[item.id];
                const curSec = activeSection[item.id];
                const tC=getC(item,"theory"),rC=getC(item,"resources"),iC=getC(item,"implementation");
                const eC = {checked:(item.extraReading||[]).filter(e=>checks[`${item.id}__extra__${e.id}`]).length, total:(item.extraReading||[]).length};
                const hasNote = notes[item.id];

                const SECS = [
                  {key:"theory",label:"Theory",emoji:"📖",stats:tC,color:"#6366f1"},
                  {key:"resources",label:"Resources",emoji:"🔗",stats:rC,color:C.accent},
                  {key:"implementation",label:"Build",emoji:"⚙️",stats:iC,color:C.yellow},
                  {key:"extraReading",label:"Extra",emoji:"✨",stats:eC,color:"#a371f7"},
                ];

                return (
                  <div key={item.id} style={{borderBottom:idx<phase.items.length-1?`1px solid ${C.border2}`:"none"}}>
                    {/* Clickable item row */}
                    <div onClick={()=>toggleItem(item.id)} style={{padding:"11px 16px",display:"flex",alignItems:"flex-start",gap:10,cursor:"pointer",background:isOpen?C.elevated:"transparent",transition:"background 0.15s"}}>
                      <button onClick={e=>cycleStatus(item.id,e)} title="Cycle status" style={{flexShrink:0,width:26,height:26,borderRadius:6,border:`1.5px solid ${st.border}`,background:st.bg,color:st.color,fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",marginTop:2}}>
                        {st.icon}
                      </button>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:8}}>
                          <div style={{flex:1}}>
                            <div style={{display:"flex",alignItems:"center",gap:5,flexWrap:"wrap"}}>
                              <span style={{fontSize:13,fontWeight:700,color:phase.color}}>{item.week}</span>
                              <span style={{fontSize:13,color:C.dim}}>·</span>
                              <span style={{fontSize:13,color:C.dim}}>{item.duration}</span>
                            </div>
                            <div style={{fontSize:18,fontWeight:600,color:status==="done"?C.dim:C.text,marginTop:1,textDecoration:status==="done"?"line-through":"none"}}>{item.title}</div>
                            <div style={{display:"flex",gap:4,marginTop:5,flexWrap:"wrap"}}>
                              {item.tags.map(t=><span key={t} style={{fontSize:12,color:C.muted,background:C.elevated,padding:"3px 9px",borderRadius:99,border:`1px solid ${C.border2}`}}>{t}</span>)}
                            </div>
                          </div>
                          <div style={{display:"flex",gap:4,flexShrink:0}} onClick={e=>e.stopPropagation()}>
                            <button onClick={()=>{setActiveNote(item.id);setNoteText(notes[item.id]||"");}} style={{width:26,height:26,borderRadius:5,border:`1px solid ${hasNote?"#1f3d5a":C.border}`,background:hasNote?"#0d1f42":"transparent",color:hasNote?C.accent:C.dim,fontSize:12,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>📝</button>
                          </div>
                        </div>

                        {isOpen && (
                          <div style={{display:"flex",gap:5,marginTop:9,flexWrap:"wrap"}} onClick={e=>e.stopPropagation()}>
                            {SECS.map(sec=>{
                              const active = curSec===sec.key;
                              return (
                                <button key={sec.key} onClick={()=>setSection(item.id,sec.key)} style={{padding:"3px 10px",borderRadius:99,border:`1px solid ${active?sec.color:C.border}`,background:active?sec.color+"20":"transparent",color:active?sec.color:C.muted,fontSize:13,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:4}}>
                                  {sec.emoji} {sec.label}
                                  {sec.stats && sec.stats.total>0 && <span style={{background:active?"rgba(255,255,255,0.15)":C.elevated,borderRadius:99,padding:"0 5px",fontSize:10}}>{sec.stats.checked}/{sec.stats.total}</span>}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Section content */}
                    {isOpen && curSec && (
                      <div style={{margin:"0 16px 12px 52px",background:C.surface,borderRadius:8,border:`1px solid ${C.border}`,padding:"12px 14px"}}>
                        {curSec==="theory" && (item.theory||[]).map(c=>(
                          <CheckRow key={c.id} checked={!!checks[`${item.id}__theory__${c.id}`]} onChange={()=>toggleCheck(item.id,"theory",c.id)} label={c.text} desc={c.desc} resource={c.resource}/>
                        ))}
                        {curSec==="resources" && (item.resources||[]).map(r=>(
                          <CheckRow key={r.id} checked={!!checks[`${item.id}__resources__${r.id}`]} onChange={()=>toggleCheck(item.id,"resources",r.id)} label={r.text} isLink url={r.url} type={r.type}/>
                        ))}
                        {curSec==="implementation" && (item.implementation||[]).map(i=>(
                          <CheckRow key={i.id} checked={!!checks[`${item.id}__implementation__${i.id}`]} onChange={()=>toggleCheck(item.id,"implementation",i.id)} label={i.text} desc={i.desc}/>
                        ))}
                        {curSec==="extraReading" && (
                          <>
                            <div style={{fontSize:11,fontWeight:700,color:"#a371f7",letterSpacing:0.5,textTransform:"uppercase",marginBottom:10}}>✨ Optional Extra Reading</div>
                            {(item.extraReading||[]).map(e=>(
                              <ExtraItem key={e.id} item={e} checked={!!checks[`${item.id}__extra__${e.id}`]} onChange={()=>toggleCheck(item.id,"extra",e.id)}/>
                            ))}
                          </>
                        )}
                      </div>
                    )}

                    {hasNote && !isOpen && (
                      <div style={{margin:"0 16px 9px 52px",fontSize:12,color:C.muted,background:C.bg,padding:"6px 10px",borderRadius:5,borderLeft:`2px solid ${phase.color}`}}>
                        {notes[item.id].length>110?notes[item.id].slice(0,110)+"...":notes[item.id]}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}

        {view==="stats" && (
          <div style={{display:"grid",gap:12}}>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
              {[
                {label:"Completed",value:done,color:C.green,bg:"#0d1f0f"},
                {label:"In Progress",value:inProg,color:C.yellow,bg:"#2d2208"},
                {label:"Remaining",value:total-done-inProg,color:C.muted,bg:C.elevated},
              ].map(c=>(
                <div key={c.label} style={{background:c.bg,borderRadius:10,border:`1px solid ${C.border}`,padding:"16px",textAlign:"center"}}>
                  <div style={{fontSize:28,fontWeight:800,color:c.color}}>{c.value}</div>
                  <div style={{fontSize:10,fontWeight:700,color:c.color,marginTop:3,textTransform:"uppercase",letterSpacing:0.5}}>{c.label}</div>
                </div>
              ))}
            </div>

            <div style={{background:C.surface,borderRadius:10,border:`1px solid ${C.border}`,padding:"16px"}}>
              <div style={{fontWeight:700,fontSize:13,marginBottom:14,color:C.text}}>Progress by Phase</div>
              {ROADMAP.map(phase=>{
                const phDone=phase.items.filter(i=>progress[i.id]==="done").length;
                const phPct=Math.round((phDone/phase.items.length)*100);
                const totalChecks=phase.items.reduce((sum,item)=>sum+["theory","resources","implementation"].reduce((s,sec)=>s+(item[sec]||[]).filter(c=>checks[`${item.id}__${sec}__${c.id}`]).length,0),0);
                const totalPossible=phase.items.reduce((sum,item)=>sum+["theory","resources","implementation"].reduce((s,sec)=>s+(item[sec]||[]).length,0),0);
                return (
                  <div key={phase.phase} style={{marginBottom:14}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                      <div style={{display:"flex",alignItems:"center",gap:7}}>
                        <div style={{width:7,height:7,borderRadius:"50%",background:phase.color}}/>
                        <span style={{fontSize:12,fontWeight:600,color:C.muted}}>{phase.phase}</span>
                      </div>
                      <div style={{display:"flex",gap:12}}>
                        <span style={{fontSize:10,color:C.dim}}>{totalChecks}/{totalPossible} tasks</span>
                        <span style={{fontSize:10,color:C.dim}}>{phDone}/{phase.items.length} concepts</span>
                      </div>
                    </div>
                    <div style={{background:C.elevated,borderRadius:99,height:4}}>
                      <div style={{background:phase.color,width:`${phPct}%`,height:"100%",borderRadius:99,transition:"width 0.4s"}}/>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{background:C.surface,borderRadius:10,border:`1px solid ${C.border}`,padding:"16px"}}>
              <div style={{fontWeight:700,fontSize:13,marginBottom:12,color:C.text}}>Your Notes</div>
              {ALL_ITEMS.filter(i=>notes[i.id]).length===0 ? (
                <div style={{color:C.dim,fontSize:12,textAlign:"center",padding:"14px 0"}}>No notes yet. Use 📝 on any concept.</div>
              ) : ALL_ITEMS.filter(i=>notes[i.id]).map(item=>(
                <div key={item.id} style={{marginBottom:9,padding:"9px 11px",background:C.bg,borderRadius:7,borderLeft:`2px solid ${C.accent}`}}>
                  <div style={{fontSize:12,fontWeight:700,color:C.text,marginBottom:2}}>{item.title}</div>
                  <div style={{fontSize:12,color:C.muted,lineHeight:1.6}}>{notes[item.id]}</div>
                </div>
              ))}
            </div>

            <div style={{textAlign:"center"}}>
              <button onClick={async()=>{
                if(!confirm("Reset all progress, checks, and notes?")) return;
                setProgress({}); setChecks({}); setNotes({});
                try{await store.set("p","{}"); await store.set("c","{}"); await store.set("n","{}");} catch{}
              }} style={{fontSize:11,color:C.red,background:"transparent",border:`1px solid #5a1e1e`,borderRadius:6,padding:"6px 13px",cursor:"pointer"}}>Reset Everything</button>
            </div>
          </div>
        )}
      </div>
      </div>

      {/* Note modal */}
      {activeNote && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:999,padding:16}}>
          <div style={{background:C.surface,borderRadius:12,padding:20,width:"100%",maxWidth:440,border:`1px solid ${C.border}`,boxShadow:"0 20px 60px rgba(0,0,0,0.5)"}}>
            <div style={{fontWeight:700,fontSize:14,marginBottom:2,color:C.text}}>{ALL_ITEMS.find(i=>i.id===activeNote)?.title}</div>
            <div style={{fontSize:11,color:C.dim,marginBottom:12}}>Key insights, links, confusion points, things to revisit</div>
            <textarea value={noteText} onChange={e=>setNoteText(e.target.value)} autoFocus placeholder="Write anything..." style={{width:"100%",height:120,padding:10,borderRadius:7,border:`1px solid ${C.border}`,fontSize:13,fontFamily:"inherit",resize:"vertical",outline:"none",color:C.text,lineHeight:1.6,boxSizing:"border-box",background:C.elevated}}/>
            <div style={{display:"flex",gap:8,marginTop:11,justifyContent:"flex-end"}}>
              <button onClick={()=>{setActiveNote(null);setNoteText("");}} style={{padding:"6px 14px",borderRadius:6,border:`1px solid ${C.border}`,background:"transparent",fontSize:12,cursor:"pointer",color:C.muted}}>Cancel</button>
              <button onClick={saveNote} style={{padding:"6px 14px",borderRadius:6,border:"none",background:C.accent,color:"#0d1117",fontSize:12,fontWeight:700,cursor:"pointer"}}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}