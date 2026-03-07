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
    phase: "Math Foundations",
    color: "#f59e0b",
    items: [
      {
        id:"mf1", week:"Pre-Foundation", title:"Linear Algebra for ML", duration:"2–3 weeks",
        tags:["linear-algebra","matrices","eigenvalues","SVD"],
        theory:[
          { id:"t1", text:"Vectors, dot products, and geometric intuition", desc:"A neural network layer is a linear transformation. Understanding what dot products measure (projection, similarity) and what matrix multiplication does geometrically is the foundation for attention, embeddings, and everything else.", resource:"3Blue1Brown — Essence of Linear Algebra" },
          { id:"t2", text:"Matrix multiplication as composition of linear transformations", desc:"Every fully-connected layer, every attention projection, every convolution is a matrix multiply. Understanding multiplication as function composition lets you reason about what stacking layers actually does.", resource:"Gilbert Strang — MIT 18.06" },
          { id:"t3", text:"Eigenvalues and eigenvectors — what they reveal about a matrix", desc:"Eigenvectors are directions a transformation only scales, not rotates. They are the foundation for PCA, gradient dynamics, spectral graph theory, and NTK analysis — all of which appear in ML research papers.", resource:"Gilbert Strang — MIT 18.06" },
          { id:"t4", text:"SVD — the fundamental matrix factorisation", desc:"SVD decomposes any matrix into rotation, scale, rotation. It underlies PCA, low-rank approximations (LoRA!), matrix compression, and recommendation systems. SVD is the single most important factorisation for ML.", resource:"Gilbert Strang — MIT 18.06" },
          { id:"t5", text:"Norms, inner products, and distances — L1, L2, cosine similarity", desc:"Loss functions, regularisation, embedding similarity, and optimisation convergence theory all depend on norms. Understanding when to use each (L2 for smooth optimisation, L1 for sparsity, cosine for direction-agnostic similarity) is essential for practical ML.", resource:"Mathematics for ML Book" },
          { id:"t6", text:"Tensors as generalisations of matrices — N-dimensional arrays in ML", desc:"Neural networks process batches of sequences of vectors — that is 3D tensors (batch × sequence × features). Attention outputs are 4D. Understanding how tensor indices map to dimensions eliminates shape bugs permanently.", resource:"PyTorch Tensor Tutorial" },
        ],
        resources:[
          { id:"r1", text:"3Blue1Brown — Essence of Linear Algebra (YouTube)", url:"https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab", type:"youtube" },
          { id:"r2", text:"Gilbert Strang — MIT 18.06 Linear Algebra (YouTube)", url:"https://www.youtube.com/playlist?list=PL49CF3715CB9EF31D", type:"youtube" },
          { id:"r3", text:"Mathematics for ML Book — Chapters 2-4, free PDF (paper)", url:"https://mml-book.github.io/", type:"paper" },
          { id:"r4", text:"Deep-ML — Linear Algebra coding problems, LeetCode-style (docs)", url:"https://www.deep-ml.com/problems", type:"docs" },
        ],
        implementation:[
          { id:"i1", text:"Implement matrix multiplication and SVD from scratch in NumPy", desc:"No np.matmul — implement the algorithm yourself. Forces you to understand the indices and dimensions, eliminating most shape bugs permanently." , megaProject:{proj:"A",step:1}},
          { id:"i2", text:"Implement PCA from scratch using SVD — visualise MNIST dimensionality reduction", desc:"Compute the covariance matrix, apply np.linalg.svd, project data onto top-k components, and plot. Seeing MNIST digits cluster in 2D gives immediate geometric intuition for what SVD finds." },
          { id:"i3", text:"Solve 10 linear algebra problems on Deep-ML — Easy/Medium tier", desc:"Deep-ML has LeetCode-style ML coding problems. 10 linear algebra problems builds mechanical fluency before starting PyTorch." },
        ],
        extraReading:[
          { id:"e1", topic:"The Matrix Cookbook — dense reference for matrix calculus identities", desc:"A concise reference for every matrix derivative, decomposition, and identity in ML papers. Bookmark it — you will return every time you read a paper with matrix calculus.", url:"https://www.math.uwaterloo.ca/~hwolkowi/matrixcookbook.pdf" },
          { id:"e2", topic:"TensorTonic — implement ML algorithms from scratch, LeetCode style", desc:"TensorTonic has 200+ ML algorithm implementation problems including transformers, BERT, ResNet, and GANs. Free tier covers all fundamentals; premium adds company-specific interview prep — worth it when 6+ months in and preparing for senior ML roles.", url:"https://www.tensortonic.com/" },
        ]
      },
      {
        id:"mf2", week:"Pre-Foundation", title:"Probability, Statistics & Calculus for ML", duration:"2–3 weeks",
        tags:["probability","statistics","calculus","gradient","bayes"],
        theory:[
          { id:"t1", text:"Probability fundamentals — distributions, expectation, variance", desc:"Loss functions are expected values of error. Regularisation is a prior. Batch normalisation uses running statistics. Every part of ML is probability — you need the language to read papers and reason about uncertainty.", resource:"Probability for ML — Goodfellow Appendix" },
          { id:"t2", text:"Key distributions — Gaussian, Bernoulli, Categorical, KL divergence", desc:"Gaussian noise is added in diffusion. Bernoulli cross-entropy is the binary classification loss. KL divergence appears in VAEs, information bottleneck, and RLHF reward optimisation. Know these cold.", resource:"Pattern Recognition — Bishop Ch.1-2" },
          { id:"t3", text:"Bayes theorem — posterior, prior, likelihood", desc:"Bayesian thinking underlies regularisation (prior over weights), probabilistic models (VAE, diffusion), and uncertainty estimation. Understanding Bayes intuitively is the door to all probabilistic ML.", resource:"Pattern Recognition — Bishop Ch.1-2" },
          { id:"t4", text:"Partial derivatives, chain rule, and the gradient — what dL/dw actually means", desc:"The gradient is the direction of steepest ascent of the loss. The chain rule computes how a weight change propagates through the network to the loss — this is backpropagation.", resource:"3Blue1Brown — What is Backpropagation?" },
          { id:"t5", text:"Jacobians and Hessians — first and second order curvature", desc:"The Jacobian is the matrix of partial derivatives. The Hessian is the matrix of second derivatives (curvature). They appear in advanced optimisation, NTK theory, and understanding loss landscape geometry.", resource:"Mathematics for ML Book Ch.5" },
          { id:"t6", text:"Central Limit Theorem — why mini-batches work", desc:"Mini-batch gradients are noisy estimates of the true gradient. CLT tells you the noise decreases as 1/sqrt(n) with batch size. This justifies why mini-batch SGD converges despite noisy gradients.", resource:"Probability for ML — Goodfellow Appendix" },
        ],
        resources:[
          { id:"r1", text:"3Blue1Brown — Calculus series (YouTube)", url:"https://www.youtube.com/playlist?list=PLZHQObOWTQDMsr9K-rj53DwVRMYO3t5Yr", type:"youtube" },
          { id:"r2", text:"Mathematics for ML Book — Chapters 5-6, free PDF (paper)", url:"https://mml-book.github.io/", type:"paper" },
          { id:"r3", text:"Pattern Recognition and ML — Bishop, free PDF (paper)", url:"https://www.microsoft.com/en-us/research/uploads/prod/2006/01/Bishop-Pattern-Recognition-and-Machine-Learning-2006.pdf", type:"paper" },
          { id:"r4", text:"StatQuest with Josh Starmer — Stats and Probability for ML (YouTube)", url:"https://www.youtube.com/c/joshstarmer", type:"youtube" },
          { id:"r5", text:"Deep-ML — Statistics and probability coding problems (docs)", url:"https://www.deep-ml.com/problems", type:"docs" },
        ],
        implementation:[
          { id:"i1", text:"Derive backpropagation by hand for a 2-layer network — on paper, no code", desc:"Derive dL/dW2 and dL/dW1 using chain rule for a network with one hidden layer and MSE loss." },
          { id:"i2", text:"Implement KL divergence and cross-entropy from scratch — verify against PyTorch", desc:"Implement KL(P||Q) and cross-entropy in NumPy. Verify they match torch.nn.KLDivLoss and F.cross_entropy on small examples." },
          { id:"i3", text:"Solve 10 probability problems on Deep-ML", desc:"Deep-ML probability section covers MLE, MAP estimation, Bayesian inference, and distribution fitting — builds statistical intuition that makes reading ML papers natural." },
        ],
        extraReading:[
          { id:"e0", topic:"Lilian Weng — Blog (lilianweng.github.io) — the best ML blog on the internet", desc:"Lilian Weng (OpenAI) writes exceptionally clear, research-grade blog posts on every major ML topic: attention mechanisms, diffusion models, LLM alignment, agents, and more. Every post is worth reading multiple times. Bookmark it and return whenever you encounter a concept you want to understand deeply.", url:"https://lilianweng.github.io/" },
          { id:"e0", topic:"Lilian Weng blog — the best ML research blog (lilianweng.github.io)", desc:"Lilian Weng (OpenAI) writes exceptionally clear research-grade blog posts on every major ML topic: attention, diffusion, LLM alignment, agents, and more. Every post is worth reading multiple times. Bookmark it now and return whenever you encounter a concept you want to understand deeply.", url:"https://lilianweng.github.io/" },
          { id:"e1", topic:"The Matrix Cookbook — calculus section for matrix derivatives", desc:"Matrix derivatives appear constantly in ML derivations. Having these identities at hand removes the algebra barrier from reading papers.", url:"https://www.math.uwaterloo.ca/~hwolkowi/matrixcookbook.pdf" },
          { id:"e2", topic:"Visual Information Theory — entropy, KL divergence explained visually", desc:"Entropy H(X) measures uncertainty. KL divergence measures distribution distance. These appear in VAEs, contrastive learning, and diffusion training objectives. This visual guide makes the concepts intuitive.", url:"https://colah.github.io/posts/2015-09-Visual-Information/" },
        ]
      },
      {
        id: "mf3", week: "Weeks 4–7", title: "Multivariable Calculus", duration: "3–4 weeks",
        tags: ["calculus","gradients","integration","vector-calculus"],
        theory: [
          { id:"t1", text:"Partial derivatives — differentiating with respect to one variable at a time", desc:"The foundation of everything in ML optimisation. When you take ∂L/∂w₁ you are holding all other weights fixed and asking how the loss changes with just that one weight. Work through problems where you compute ∂f/∂x and ∂f/∂y for progressively complex functions — polynomials, exponentials, trig. Do not move on until partial differentiation feels mechanical.", resource:"APEX Calculus Vol.3, Ch.12-14 (free PDF)" },
          { id:"t2", text:"Gradient vector — assembling partials into a direction of steepest ascent", desc:"The gradient ∇f = (∂f/∂x, ∂f/∂y, ∂f/∂z) packages all partial derivatives into one vector that points uphill. Gradient descent goes downhill by subtracting this vector scaled by a learning rate. Drill: compute gradients of quadratic functions, verify the direction geometrically, confirm that moving against the gradient decreases the function value.", resource:"APEX Calculus Vol.3, Ch.12-14 (free PDF)" },
          { id:"t3", text:"Chain rule for multivariate functions — how gradients flow through compositions", desc:"If z = f(x,y) and x,y are themselves functions of t, then dz/dt = (∂f/∂x)(dx/dt) + (∂f/∂y)(dy/dt). This is backpropagation. Every ∂L/∂wᵢ in a neural network is a chain rule application through a computational graph. Spend a week on this until you can trace any composition by hand.", resource:"Paul's Online Math Notes — Partial Derivatives" },
          { id:"t4", text:"Directional derivatives and the gradient theorem", desc:"The directional derivative Dᵤf tells you the rate of change in any direction u. The theorem: it equals ∇f · u — the dot product of the gradient and the direction. This means the gradient direction is the direction of maximum increase, which is exactly why gradient descent works.", resource:"MIT 18.02 OCW — Notes" },
          { id:"t5", text:"Hessian matrix — second-order derivatives and curvature", desc:"The Hessian H is the matrix of all second partial derivatives: Hᵢⱼ = ∂²f/∂xᵢ∂xⱼ. It tells you the curvature of the loss landscape. Positive definite Hessian → local minimum. Indefinite → saddle point. This is why second-order optimisers like Newton's method work, and why saddle points are a training concern. Practice computing Hessians for 2-variable functions.", resource:"APEX Calculus Vol.3, Ch.12-14 (free PDF)" },
          { id:"t6", text:"Double and triple integrals — integrating over 2D and 3D regions", desc:"Extend single-variable integration to multiple dimensions. Double integral ∫∫f(x,y)dA computes volume under a surface or total probability mass over a 2D region. Iterated integrals: integrate with respect to x first (treating y as constant), then y. Do 20+ problems working through different region shapes — rectangles, triangles, circles.", resource:"APEX Calculus Vol.3, Ch.14-15 (free PDF)" },
          { id:"t7", text:"Change of variables and the Jacobian determinant", desc:"When you change coordinates (polar, cylindrical, spherical) the Jacobian |J| accounts for how areas and volumes distort under the transformation. For polar: dA = r dr dθ, not just dr dθ. In ML: normalising flows use Jacobians to track how probability density changes under a learned transformation. This is the geometric meaning of the determinant.", resource:"APEX Calculus Vol.3, Ch.14-15 (free PDF)" },
          { id:"t8", text:"Line integrals and vector fields", desc:"A line integral ∫_C F · dr integrates a vector field along a curve — used in physics for work done by a force, in ML theory for path-dependent quantities in loss landscapes. The fundamental theorem of line integrals says: if F = ∇f (conservative field), the integral depends only on endpoints. This is why gradient fields are special.", resource:"APEX Calculus Vol.3, Ch.15-16 (free PDF)" },
          { id:"t9", text:"Green's, Stokes', and Divergence theorems — overview and geometric intuition", desc:"These theorems connect integrals of different dimensions: Green's links a line integral around a closed curve to a double integral over the enclosed region. Stokes' generalises to surfaces. Divergence theorem relates surface integrals to volume integrals. You will not use these daily in ML but seeing them closes the circle on vector calculus and they appear in physics-informed ML.", resource:"3Blue1Brown — Divergence and Curl (YouTube)" },
        ],
        resources: [
          { id:"r1", text:"APEX Calculus Vol.3 — free open-source textbook, same content as Thomas (PDF)", url:"http://www.apexcalculus.com/downloads", type:"docs" },
          { id:"r2", text:"Paul's Online Math Notes — Calculus III (free, problem-heavy) (blog)", url:"https://tutorial.math.lamar.edu/Classes/CalcIII/CalcIII.aspx", type:"blog" },
          { id:"r3", text:"MIT 18.02 Multivariable Calculus — OCW full course with problem sets (course)", url:"https://ocw.mit.edu/courses/18-02sc-multivariable-calculus-fall-2010/", type:"course" },
          { id:"r4", text:"3Blue1Brown — Essence of Calculus series (YouTube)", url:"https://www.youtube.com/playlist?list=PLZHQObOWTQDMsr9K-rj53DwVRMYO3t5Yr", type:"youtube" },
          { id:"r5", text:"Professor Leonard — Calculus 3 full lectures (YouTube)", url:"https://www.youtube.com/playlist?list=PLDesaqWTN534e1UqnnaGBkrgobn7j2-v-", type:"youtube" },
          { id:"r6", text:"Khan Academy — Multivariable Calculus (course)", url:"https://www.khanacademy.org/math/multivariable-calculus", type:"course" },
        ],
        implementation: [
          { id:"i1", text:"APEX Calculus Vol.3 problem sets — partial derivatives and gradient: complete every odd-numbered problem", desc:"Odd-numbered problems have answers in the back — do them, check immediately, move on. Do not skip ugly-looking problems; those are the ones that build muscle memory. Target: 40+ problems over 3 days. The feel you are after: pick up book, do a problem in 5 minutes, tick it, do the next." },
          { id:"i2", text:"Compute gradients and Hessians for 5 ML loss functions by hand — MSE, cross-entropy, L2 regularisation, softmax loss, log-likelihood", desc:"These are not textbook exercises — they are the actual functions you minimise in ML. Derive ∂L/∂w and ∂²L/∂w² for each. Verify against autograd (your Step 2 from-scratch engine or PyTorch). When your hand-computed gradient matches autograd, you understand what the optimiser is doing." },
          { id:"i3", text:"MIT 18.02 OCW problem sets 1–5 — work on paper, check with solution keys", desc:"MIT publishes full problem sets and solutions for 18.02. Print them. Work with pencil. Mark each one done. The solution keys let you self-grade immediately — do not look at the solution before attempting. Aim for 80% correct without help; the 20% you get wrong are the most valuable." },
          { id:"i4", text:"Paul's Online Math Notes — complete the Partial Derivatives and Multiple Integrals practice sections", desc:"Paul's notes are written for engineering students and have practice problems at every difficulty level with full worked solutions. The problems feel like homework sets. Work through them in order — they build on each other within each section." },
          { id:"i5", text:"Change of variables drill: convert 10 double integrals to polar coordinates and evaluate", desc:"Polar integrals over circular regions are significantly simpler than Cartesian ones. This drill makes the substitution mechanical: r² = x² + y², dA = r dr dθ. Pick 10 problems from Thomas Ch.15 involving circular or annular regions." },
        ],
        extraReading: [
          { id:"e1", topic:"Mathematical Tools for Physics — Nearing (free PDF) — 500-page engineering maths bible", desc:"Kreyszig covers ODEs, linear algebra, vector calculus, complex analysis, PDEs, and numerical methods in one 1200-page volume. Not for cover-to-cover reading — use as a reference when you encounter a topic in scientific ML (PDEs in physics-informed NNs, Fourier analysis in FNO) and want the full engineering treatment.", url:"https://www-mdp.eng.cam.ac.uk/web/library/enginfo/textbooks_dvd_only/nearing/math_methods.pdf" },
          { id:"e2", topic:"3Blue1Brown — What is a Fourier transform? (visual intuition)", desc:"The Fourier transform decomposes a function into its frequency components. This visual explanation builds geometric intuition before you encounter it formally in ODEs and in the FNO (which operates in Fourier space). Worth watching before the differential equations phase.", url:"https://www.youtube.com/watch?v=spUNpyF58BY" },
          { id:"e3", topic:"Khan Academy — Jacobian intuition (short video series)", desc:"The Jacobian appears in change of variables, normalising flows, and sensitivity analysis. Khan's visual treatment — showing how the Jacobian measures local area distortion — is clearer than most textbooks.", url:"https://www.khanacademy.org/math/multivariable-calculus/multivariable-derivatives/jacobian/v/the-jacobian-matrix" },
        ],
      },
      {
        id: "mf4", week: "Weeks 7–9", title: "Differential Equations & Transforms", duration: "2–3 weeks",
        tags: ["ODEs","laplace","fourier","dynamical-systems"],
        theory: [
          { id:"t1", text:"First-order ODEs — separable equations, linear equations, integrating factor method", desc:"A first-order ODE relates a function to its first derivative: dy/dx = f(x,y). Separable equations split into g(y)dy = h(x)dx and integrate both sides. Linear first-order ODEs use the integrating factor μ(x) = e^∫P(x)dx. These appear in learning rate schedules (exponential decay is an ODE solution), population dynamics, and simple physics. Do 20+ problems of each type until the method is automatic.", resource:"Nearing — Mathematical Tools, Ch.4 ODEs (free PDF)" },
          { id:"t2", text:"Second-order linear ODEs — characteristic equation, homogeneous and particular solutions", desc:"Second-order ODEs model oscillations and waves: ay'' + by' + cy = f(x). The homogeneous solution comes from the characteristic equation ar² + br + c = 0. Three cases: real distinct roots (exponential decay), repeated roots (critically damped), complex roots (oscillatory). The particular solution handles the forcing term f(x). These model the dynamics of physical systems — springs, circuits, beams under load.", resource:"Nearing — Mathematical Tools, Ch.4 ODEs (free PDF)" },
          { id:"t3", text:"Systems of ODEs — matrix form, eigenvalue method, phase portraits", desc:"A system of first-order ODEs can be written as x' = Ax where A is a matrix. The solution uses eigenvalues and eigenvectors of A — connecting ODEs back to the linear algebra you built in mf1. Phase portraits visualise the trajectories of 2D systems: stable spirals, unstable saddles, centres. This is the mathematical foundation for dynamical systems and recurrent neural networks.", resource:"MIT 18.03 OCW — Notes" },
          { id:"t4", text:"Laplace transform — converting ODEs to algebra, solving with initial conditions", desc:"The Laplace transform L{f(t)} = ∫₀^∞ f(t)e^(-st)dt converts an ODE into an algebraic equation in s-space, which you solve, then inverse-transform back. Crucial for engineering: it handles initial conditions cleanly and converts convolution to multiplication. You will encounter it in signal processing, control theory, and when reading about continuous-time dynamical systems.", resource:"Paul's Online Math Notes — Laplace Transforms" },
          { id:"t5", text:"Fourier series — representing periodic functions as sums of sines and cosines", desc:"Any reasonable periodic function f(t) can be written as a₀/2 + Σ(aₙcos(nωt) + bₙsin(nωt)). The coefficients are computed by integrating against sin and cos — exploiting orthogonality. Fourier series is the gateway to Fourier transforms, which underlie signal processing, audio ML, and the spectral convolution in FNO (Project C Step 1). Do problems computing Fourier series for square waves, triangles, and sawtooth functions.", resource:"Nearing — Mathematical Tools, Ch.7 Fourier (free PDF)" },
          { id:"t6", text:"Fourier transform — extending Fourier series to aperiodic functions, convolution theorem", desc:"The Fourier transform F(ω) = ∫_{-∞}^{∞} f(t)e^(-iωt)dt decomposes any function (not just periodic ones) into frequency components. The convolution theorem: convolution in time = multiplication in frequency — this is why CNNs can be computed efficiently in Fourier space, and it is the mathematical core of the FNO spectral convolution layer.", resource:"3Blue1Brown — But what is the Fourier Transform? (YouTube)" },
          { id:"t7", text:"Partial differential equations — heat equation, wave equation, Laplace equation", desc:"PDEs involve partial derivatives with respect to multiple variables (usually space and time). The heat equation ∂u/∂t = α∇²u models diffusion. The wave equation ∂²u/∂t² = c²∇²u models propagation. These are the equations that neural operators (FNO, DeepONet) learn to solve. You do not need to solve arbitrary PDEs from scratch — you need enough fluency to read PDE papers.", resource:"Nearing — Mathematical Tools, Ch.8 PDEs (free PDF)" },
        ],
        resources: [
          { id:"r1", text:"MIT 18.03 Differential Equations — OCW full course with problem sets (course)", url:"https://ocw.mit.edu/courses/18-03sc-differential-equations-fall-2011/", type:"course" },
          { id:"r2", text:"Paul's Online Math Notes — Differential Equations (free, with practice problems) (blog)", url:"https://tutorial.math.lamar.edu/Classes/DE/DE.aspx", type:"blog" },
          { id:"r3", text:"Professor Leonard — Differential Equations playlist (YouTube)", url:"https://www.youtube.com/playlist?list=PLDesaqWTN53ZLZGzma-C5LZGLivPkOo_Z", type:"youtube" },
          { id:"r4", text:"3Blue1Brown — But what is a Fourier transform? (YouTube)", url:"https://www.youtube.com/watch?v=spUNpyF58BY", type:"youtube" },
          { id:"r5", text:"Mathematical Tools for Physics — Nearing (free PDF, 500pp, ODEs/PDEs/Fourier/Laplace)", url:"https://www-mdp.eng.cam.ac.uk/web/library/enginfo/textbooks_dvd_only/nearing/math_methods.pdf", type:"docs" },
          { id:"r6", text:"Khan Academy — Differential Equations (course)", url:"https://www.khanacademy.org/math/differential-equations", type:"course" },
        ],
        implementation: [
          { id:"i1", text:"Paul's Online Math Notes — complete all first-order ODE practice sections: separable, linear, exact", desc:"Paul's DE section has practice problems at every level with full worked solutions. Work through all three first-order types in order. Check each answer immediately. By the end of this section you should be able to classify a first-order ODE on sight and know which method to apply." },
          { id:"i2", text:"MIT 18.03 OCW problem sets 1–3 — second-order ODEs on paper, check with solution keys", desc:"Second-order ODEs are the main event in engineering mathematics. MIT's 18.03 problem sets are the real thing — they are the exact homework sets MIT students work through. Print, pencil, check. Do not skip the parts that require sketching phase portraits — the geometric intuition is worth the time." },
          { id:"i3", text:"Compute Fourier series by hand for a square wave, triangle wave, and sawtooth wave", desc:"These three canonical waveforms are the standard Fourier series exercises in every engineering textbook. The square wave: f(t) = 4/π Σ sin(nωt)/n for odd n. Derive this yourself by computing the integral for each coefficient. When you can derive this without looking at notes, you understand Fourier series." },
          { id:"i4", text:"Solve 5 ODEs using Laplace transforms — convert, solve in s-domain, inverse transform", desc:"Pick 5 problems from Paul's notes or Kreyszig involving second-order ODEs with initial conditions. Solve each using Laplace: take transform of both sides, solve for Y(s), partial fraction decompose, inverse transform. Check against direct method if you know it. The Laplace method should feel mechanical by problem 5." },
          { id:"i5", text:"Numerically solve a simple ODE in Python using scipy.integrate.solve_ivp — plot the phase portrait", desc:"After solving ODEs by hand, bridge to computation: take the simple pendulum ODE θ'' + sin(θ) = 0, convert to a system, and solve numerically with scipy. Plot the phase portrait (θ vs θ'). This connects your hand analysis to the numerical solvers that scientific ML replaces." },
        ],
        extraReading: [
          { id:"e1", topic:"Strogatz — Nonlinear Dynamics and Chaos — free lecture series by the author (YouTube)", desc:"Strogatz's book is the most readable dynamical systems text ever written. It covers bifurcations, limit cycles, chaos, and fractals with almost no prerequisites beyond calculus. Read Chapter 1-3 after finishing mf4 — it shows why ODEs are the language of everything from neural oscillations to climate models.", url:"https://www.youtube.com/playlist?list=PLbN57C5Zdl6j_qJA-pARJnKsmROzPnO9V" },
          { id:"e2", topic:"3Blue1Brown — Differential equations overview (the unreasonable effectiveness of ODEs)", desc:"A visual 20-minute overview of why differential equations appear everywhere in physics, biology, and engineering. Pairs beautifully with the Strogatz book as a motivation before diving into problem sets.", url:"https://www.youtube.com/watch?v=p_di4Zn4wz4" },
          { id:"e3", topic:"MIT 18.03 Lecture Notes — Haynes Miller (very clean, free PDF)", desc:"Miller's lecture notes for 18.03 are cleaner and more modern than Kreyszig for the ODE sections. Free PDF. Particularly good on linear systems and phase portraits.", url:"https://ocw.mit.edu/courses/18-03sc-differential-equations-fall-2011/pages/unit-i-first-order-differential-equations/" },
        ],
      },
    ]
  },
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
        { id:"r4", text:"fast.ai — Practical Deep Learning for Coders (YouTube/docs)", url:"https://course.fast.ai/", type:"course" },
          { id:"r5", text:"Daniel Bourke — PyTorch for Deep Learning (GitHub)", url:"https://github.com/mrdbourke/pytorch-deep-learning", type:"docs" },
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
    },
      {
        id:"eng1", week:"Throughout", title:"Engineering Fundamentals for ML", duration:"Pick up as you go",
        tags:["python","git","docker","sql","unix","code-review"],
        theory:[
          { id:"t1", text:"Python beyond basics — generators, decorators, context managers, async/await", desc:"Production agent code at Marvell uses all of these. Generators for streaming token outputs without loading into memory. Decorators for retry logic, logging, and rate-limiting wrappers on LLM calls. Context managers for database connections and HTTP sessions. Async/await for running multiple LLM API calls concurrently without blocking — one of the highest-leverage performance wins in agent systems.", resource:"Real Python — Advanced Python" },
          { id:"t2", text:"Type hints, dataclasses, and Pydantic — self-documenting, validated code", desc:"Type hints make code readable and enable IDE autocompletion — critical in large agent codebases. Pydantic enforces schema validation at runtime (the same library LangChain and FastAPI use internally). Dataclasses reduce boilerplate for data containers. These are the three pillars of clean Python in production ML systems.", resource:"Pydantic Docs" },
          { id:"t3", text:"Git workflows in a team — branching, PRs, rebasing, good commit messages", desc:"This was your admitted pain point from the Marvell internship. The essentials: feature branches, PR descriptions that explain why not just what, rebasing vs merging (rebase for clean linear history, merge for preserving branch context), squashing noisy commits before review. A well-written PR is how senior engineers evaluate your thinking, not just your code.", resource:"Atlassian Git Tutorials" },
          { id:"t4", text:"Docker for ML — containerise your model serving code so it runs identically everywhere", desc:"Docker encapsulates code, Python version, system libraries, and dependencies into a single image. For ML: training happens outside Docker, serving happens inside (guarantees reproducibility). The core workflow: write a Dockerfile, build an image, run a container, expose a port. This closes the gap between a working notebook and a deployable service.", resource:"TechWorld with Nana — Docker for Beginners" },
          { id:"t5", text:"SQL — joins, window functions, CTEs, aggregations", desc:"ML pipelines are full of data that lives in databases. You do not need to be a data engineer, but being able to write a non-trivial query yourself is a professional force multiplier. Specifically: JOIN types (inner, left, anti-join), window functions (ROW_NUMBER, LAG, LEAD for time series), CTEs for readable multi-step queries, and GROUP BY aggregations for dataset statistics.", resource:"Mode SQL Tutorial" },
          { id:"t6", text:"Unix/shell — navigation, tmux, grep/awk, basic scripting on remote servers", desc:"Remote GPU machines are Linux servers with no GUI. You will ssh in, navigate with cd/ls/find, inspect processes with htop/nvidia-smi, tail logs with tail -f, search with grep, and run long training jobs inside tmux sessions so they survive disconnection. This is the daily environment for anyone training or serving models.", resource:"The Missing Semester — MIT" },
          { id:"t8", text:"Object-oriented programming — classes, inheritance, dunder methods, design patterns", desc:"Python OOP is the backbone of every ML framework. PyTorch modules are classes (nn.Module). Datasets are classes. Trainers are classes. Understanding OOP means you can extend any framework, not just call its APIs. Key concepts: classes and objects, encapsulation (__init__, self), inheritance (class MyModel(nn.Module)), polymorphism (overriding forward()), dunder/magic methods (__len__, __getitem__, __repr__ — the ones PyTorch Dataset requires), abstract base classes (abc.ABC for interfaces), and the four design patterns you will encounter constantly in ML code: Factory (creating objects without specifying class), Strategy (swappable algorithms like loss functions), Observer (callbacks and hooks), and Decorator (Python @decorator syntax — which you already use).", resource:"Real Python — OOP in Python" },
          { id:"t7", text:"Code review culture — giving and receiving feedback professionally", desc:"Code review at Marvell is how the team maintains quality and shares knowledge. As a reviewee: respond to every comment, explain your reasoning when you disagree. As a reviewer: focus on logic not style, ask questions rather than make demands, acknowledge good code. Mastering this makes you a valued team member immediately.", resource:"Google Engineering Practices — Code Review" },
        ],
        resources:[
          { id:"r1", text:"Real Python — Advanced Python concepts (blog)", url:"https://realpython.com/tutorials/advanced/", type:"blog" },
          { id:"r2", text:"TechWorld with Nana — Docker for Beginners (YouTube)", url:"https://www.youtube.com/watch?v=3c-iBn73dDE", type:"youtube" },
          { id:"r3", text:"Atlassian Git Tutorials — Workflows and Branching (docs)", url:"https://www.atlassian.com/git/tutorials/comparing-workflows", type:"docs" },
          { id:"r4", text:"Mode SQL Tutorial — Intermediate and Advanced SQL (docs)", url:"https://mode.com/sql-tutorial/", type:"docs" },
          { id:"r5", text:"The Missing Semester of Your CS Education — MIT (YouTube)", url:"https://missing.csail.mit.edu/", type:"course" },
          { id:"r6", text:"Google Engineering Practices — Code Review Guide (docs)", url:"https://google.github.io/eng-practices/review/", type:"docs" },
          { id:"r7", text:"DataLemur — SQL practice problems, interview style (docs)", url:"https://datalemur.com/sql-tutorial", type:"docs" },
          { id:"r8", text:"SQLZoo — Interactive SQL practice in browser (docs)", url:"https://sqlzoo.net/", type:"docs" },
          { id:"r9", text:"Real Python — OOP in Python 3 (blog)", url:"https://realpython.com/python3-object-oriented-programming/", type:"blog" },
          { id:"r10", text:"ArjanCodes — OOP and Design Patterns in Python (YouTube)", url:"https://www.youtube.com/c/ArjanCodes", type:"youtube" },
        ],
        implementation:[
          { id:"i1", text:"Rewrite a sequential LLM pipeline using async — measure latency improvement", desc:"Take an existing sequential LLM pipeline (call API, wait, call API, wait). Rewrite using asyncio.gather to parallelise calls. Measure wall-clock time before and after. A 3-5x speedup on 10 concurrent calls is typical." , megaProject:{proj:"B",step:1}},
          { id:"i2", text:"Containerise a FastAPI model-serving endpoint with Docker — one-command startup", desc:"Write a Dockerfile for a FastAPI app that loads a model and serves predictions. Build the image, run the container, and hit the /predict endpoint. Then write a docker-compose.yml that spins up the API plus a Redis cache together. This is the complete local deployment stack." },
          { id:"i3", text:"Open a real PR with a proper description and respond to every review comment", desc:"Make a non-trivial change to your ML project repo, write a PR description with background, what changed, and how you tested it. Ask a peer to review. Address every comment in writing. This single exercise makes the Marvell PR process feel natural." },
          { id:"i4", text:"Solve 20 SQL problems on DataLemur — focus on window functions and JOINs", desc:"Window functions (ROW_NUMBER, RANK, LAG, SUM OVER) and multi-table JOINs are the two things that make SQL feel powerful. Complete 20 problems specifically targeting these." },
          { id:"i5", text:"Set up tmux on a remote machine and run a training job that survives SSH disconnect", desc:"SSH into a remote server, start a tmux session, launch a training script, detach (Ctrl+B then D), close the terminal, reconnect via SSH, reattach to find training still running. Most practically useful Unix skill." },
          { id:"i6", text:"Rewrite a plain-function ML pipeline as proper OOP — Dataset class, Model class, Trainer class", desc:"Take a script you have written with loose functions. Refactor into three classes: a Dataset class with __len__ and __getitem__ (what PyTorch expects), a Model class inheriting nn.Module with forward(), and a Trainer class owning the training loop. This teaches how ML frameworks are designed from the inside." },
        ],
        extraReading:[
          { id:"e1", topic:"Dive Into Python 3 — free, deep coverage of Python internals, data model, and idiomatic code", desc:"The best single resource for understanding Python deeply: data model, iterators, generators, coroutines, metaprogramming. Use it as a reference when you encounter something you do not fully understand.", url:"https://diveintopython3.net/" },
          { id:"e2", topic:"Oh My Zsh + fzf + zoxide — making the terminal enjoyable", desc:"Most ML engineers spend hours per day in the terminal. Oh My Zsh adds git branch display and smart tab completion. fzf adds fuzzy file search. zoxide replaces cd with a smart jump to frequently used directories. Combined they make remote server work significantly faster.", url:"https://ohmyz.sh/" },
          { id:"e4", topic:"SOLID principles for ML code — single responsibility, open/closed, dependency inversion", desc:"SOLID principles applied to ML: Single Responsibility (your Dataset class should not also run training). Open/Closed (your Trainer should be extensible via callbacks without modifying its core). Dependency Inversion (depend on abstract interfaces, not concrete implementations — makes swapping optimisers or loss functions trivial). These principles explain why production ML codebases are structured the way they are.", url:"https://realpython.com/solid-principles-python/" },
          { id:"e3", topic:"Pre-commit hooks — automated code quality checks before every commit", desc:"Pre-commit runs black (formatting), ruff (linting), and mypy (type checking) automatically before every git commit. Catches style issues before they reach PR review. Standard setup in most production ML codebases.", url:"https://pre-commit.com/" },
        ]
      },
    ]
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
          { id:"r2", text:"Andrew Ng — Supervised ML: Regression and Classification (free to audit on Coursera)", url:"https://www.coursera.org/learn/machine-learning", type:"course" },
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
          { id:"r2", text:"Andrej Karpathy — Neural Networks: Zero to Hero (series)", url:"https://www.youtube.com/playlist?list=PLAqhIrjkxbuWI23v9cThsA9GvCAUhRvKZ", type:"youtube" },
          { id:"r3", text:"CS231n — Backpropagation Notes (blog)", url:"https://cs231n.github.io/optimization-2/", type:"blog" },
          { id:"r4", text:"Karpathy — micrograd (YouTube)", url:"https://www.youtube.com/watch?v=VMj-3S1tku0", type:"youtube" },
        ],
        implementation: [
          { id:"i1", text:"Implement micrograd — type every line yourself", desc:"Karpathy's micrograd is 100 lines that contain all of deep learning's math; typing it yourself is the single best thing you can do this month." , megaProject:{proj:"A",step:2}},
          { id:"i2", text:"2-layer neural network in NumPy with manual forward + backward", desc:"Implementing backprop from scratch in NumPy is the proving ground — if you can do this, you understand neural networks." , megaProject:{proj:"A",step:3}},
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
          { id:"e1", topic:"Bayesian interpretation of L2 — Gaussian prior over weights", desc:"L2 regularisation has a Bayesian interpretation as placing a Gaussian prior over weights; this framework lets you reason about regularisation more principled.", url:"https://agustinus.kristia.de/blog/bayesian-regularization/" },
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
          { id:"e5", topic:"DenseNet — concatenating instead of adding, feature reuse", desc:"DenseNet connects every layer to all subsequent layers via concatenation (not addition like ResNet). This encourages feature reuse at every depth and gives the network implicit deep supervision.", url:"https://arxiv.org/abs/1608.06993" },
          { id:"e6", topic:"EfficientNet — jointly scaling width, depth, resolution", desc:"EfficientNet's compound scaling coefficient shows that scaling all three dimensions together under a fixed compute budget outperforms scaling any one alone — foundational reading for efficient model design.", url:"https://arxiv.org/abs/1905.11946" },
          { id:"e7", topic:"ConvNeXt — a ResNet upgraded with ViT training recipes", desc:"Systematic modernisation of ResNet using ViT insights: 7×7 depthwise conv, inverted bottleneck, fewer activations, GELU, LayerNorm. Matched ViT accuracy — showing training recipes mattered as much as architecture.", url:"https://arxiv.org/abs/2201.03545" },
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
          { id:"i2", text:"Implement multi-head attention from scratch", desc:"Splitting into heads, running parallel attention, and concatenating projections is the critical implementation detail that most tutorials skip." , megaProject:{proj:"A",step:4}},
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
          { id:"i1", text:"Build a decoder-only Transformer (GPT-style) from scratch", desc:"Every component — embedding, positional encoding, causal attention, FFN, LayerNorm, output projection — implemented yourself in pure PyTorch." , megaProject:{proj:"A",step:5}},
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
          { id:"e6", topic:"Linformer — O(n) attention via low-rank key/value projection", desc:"Standard attention is O(n²) in sequence length. Linformer projects keys and values down to a fixed-size matrix, reducing complexity to O(n) — the clearest illustration of the quadratic bottleneck and how to attack it.", url:"https://arxiv.org/abs/2006.04768" },
          { id:"e7", topic:"State Space Models (S4, Mamba) — sequences at linear cost", desc:"SSMs model sequences as discretised linear dynamical systems. During training they run as convolutions (parallel); at inference as recurrences (constant memory). Mamba adds input-dependent selectivity, matching Transformer quality at O(n) cost.", url:"https://arxiv.org/abs/2312.00752" },
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
          { id:"r2", text:"LangChain Docs — Agents (docs)", url:"https://python.langchain.com/docs/concepts/agents/", type:"docs" },
          { id:"r3", text:"Andrew Ng — AI Agentic Design Patterns (YouTube)", url:"https://www.youtube.com/watch?v=sal78ACtGTc", type:"youtube" },
          { id:"r4", text:"LangGraph Docs (docs)", url:"https://langchain-ai.github.io/langgraph/", type:"docs" },
          { id:"r5", text:"Lilian Weng — LLM-Powered Autonomous Agents (blog)", url:"https://lilianweng.github.io/posts/2023-06-23-agent/", type:"blog" },
        ],
        implementation: [
          { id:"i1", text:"Build a ReAct agent from scratch with 2-3 custom tools", desc:"Writing the agent loop yourself — parse reasoning, execute tool, feed result back — demystifies what LangChain is actually doing under the hood." , megaProject:{proj:"B",step:2}},
          { id:"i2", text:"Implement the same agent in LangChain — compare abstraction", desc:"After building it manually, LangChain's abstractions will make complete sense rather than feeling like magic." },
          { id:"i3", text:"Build a stateful multi-step agent with LangGraph", desc:"LangGraph's graph-based state machine handles complex agent workflows that linear chains can't express; building one teaches you production-grade agent architecture." },
          { id:"i4", text:"Intentionally cause and debug each failure mode", desc:"Deliberately triggering hallucination, infinite loops, and context overflow makes you prepared to recognise and fix these in production." },
        ],
        extraReading: [
          { id:"e1", topic:"Tree of Thoughts — exploring multiple reasoning paths", desc:"ToT extends chain-of-thought by having the LLM generate and evaluate multiple reasoning branches before committing, improving performance on complex planning tasks.", url:"https://arxiv.org/abs/2305.10601" },
          { id:"e2", topic:"Agent memory architectures — episodic, semantic, procedural", desc:"Different types of memory serve different purposes in agents; understanding the taxonomy helps you design memory systems that actually improve agent performance.", url:"https://lilianweng.github.io/posts/2023-06-23-agent/" },
          { id:"e3", topic:"Sandboxing LLM-generated code — safe execution environments", desc:"Agents that write and execute code need secure sandboxing; understanding the threat model and available solutions (E2B, Modal) is essential for production code agents.", url:"https://e2b.dev/blog/sandboxing-llm-generated-code" },
          { id:"e4", topic:"Plan-and-Execute agents — separating planning from execution", desc:"Some tasks benefit from generating a full plan before executing any step; this reduces error propagation and allows plan revision based on intermediate results.", url:"https://blog.langchain.com/plan-and-execute-agents/" },
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
          { id:"i1", text:"Build a full RAG pipeline with LlamaIndex + a vector DB", desc:"End-to-end: ingest documents, chunk them, embed them, store in a vector DB, retrieve for queries, and generate answers — the complete production RAG loop." , megaProject:{proj:"B",step:3}},
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
          { id:"r2", text:"Full Stack LLM Bootcamp, free (blog/video series)", url:"https://fullstackdeeplearning.com/llm-bootcamp/", type:"docs" },
          { id:"r3", text:"NeMo Guardrails — NVIDIA (docs)", url:"https://github.com/NVIDIA/NeMo-Guardrails", type:"docs" },
          { id:"r4", text:"Stanford CS329S — Designing ML Systems, Chip Huyen's free course slides + readings", url:"https://stanford-cs329s.github.io/", type:"course" },
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
      {
        id:"g5", week:"Prep Week 5", title:"GenAI Frameworks Deep Dive", duration:"1–2 weeks",
        tags:["llamaindex","crewai","autogen","dspy","haystack","frameworks"],
        theory:[
          { id:"t1", text:"LlamaIndex — RAG-first framework with data connectors and query engines", desc:"LlamaIndex is built around data ingestion, indexing, and querying. Its abstractions (Document, Node, Index, QueryEngine, ReActAgent) map directly onto production RAG architecture. For retrieval-heavy applications over enterprise documents, LlamaIndex has richer primitives than LangChain.", resource:"LlamaIndex Docs" },
          { id:"t2", text:"LangGraph vs LangChain — when to use each", desc:"LangChain is a collection of integrations with a chain abstraction — good for simple sequential pipelines. LangGraph adds stateful graph execution for complex branching, loops, and human-in-the-loop. Use LangChain for simple pipelines; switch to LangGraph the moment your agent has conditional logic or cycles.", resource:"LangGraph Docs" },
          { id:"t3", text:"CrewAI — role-based multi-agent collaboration", desc:"CrewAI abstracts agents as crew members with roles, goals, and backstories. Agents collaborate on tasks with defined processes (sequential or hierarchical). Best for document-centric multi-agent tasks where role specialisation improves output consistency.", resource:"CrewAI Docs" },
          { id:"t4", text:"AutoGen — conversational multi-agent framework from Microsoft", desc:"AutoGen models agents as participants in a conversation. The UserProxyAgent/AssistantAgent pattern is the starting point. More flexible than CrewAI for dynamic conversation flows and human-in-the-loop interrupts.", resource:"AutoGen Docs" },
          { id:"t5", text:"DSPy — declarative, optimisable prompting as code", desc:"DSPy replaces hand-written prompts with declared input/output signatures (Modules) and optimises them automatically. Instead of manually tuning prompts, you define what you want and DSPy compiles the best prompt configuration. Fundamentally changes how you approach prompt engineering.", resource:"Stanford DSPy Paper" },
          { id:"t6", text:"OpenAI Agents SDK — managed runtime with built-in tools and handoffs", desc:"OpenAI Agents SDK provides a lightweight framework for building agents: tool definitions, parallel function calling, agent handoffs, and a built-in tracing runtime. The fastest path to a working agent if you are already on the OpenAI stack.", resource:"OpenAI Agents Docs" },
          { id:"t7", text:"Framework selection criteria — when to use which tool", desc:"LlamaIndex: retrieval-heavy, document-centric. LangGraph: complex state, branching, production. CrewAI: role-based multi-agent. AutoGen: dynamic conversational agents. DSPy: when prompt quality is a bottleneck and you want systematic optimisation. OpenAI SDK: fastest path on OpenAI stack.", resource:"Agent Frameworks Comparison 2025" },
        ],
        resources:[
          { id:"r1", text:"DeepLearning.AI — Building Agentic RAG with LlamaIndex (free course)", url:"https://learn.deeplearning.ai/courses/building-agentic-rag-with-llamaindex", type:"course" },
          { id:"r2", text:"DeepLearning.AI — AI Agents in LangGraph (free course)", url:"https://learn.deeplearning.ai/courses/ai-agents-in-langgraph", type:"course" },
          { id:"r3", text:"DeepLearning.AI — Multi AI Agent Systems with CrewAI (free course)", url:"https://learn.deeplearning.ai/courses/multi-ai-agent-systems-with-crewai", type:"course" },
          { id:"r4", text:"DSPy Documentation (docs)", url:"https://dspy.ai/", type:"docs" },
          { id:"r5", text:"Stanford CS146S — The Modern Software Developer (blog)", url:"https://themodernsoftware.dev/", type:"blog" },
          { id:"r6", text:"DeepLearning.AI Short Courses — full catalogue", url:"https://www.deeplearning.ai/short-courses/", type:"course" },
        
          { id:"r_sw", text:"Simon Willison — LLM blog, always current (blog)", url:"https://simonwillison.net/", type:"blog" },],
        implementation:[
          { id:"i1", text:"Build the same RAG pipeline in LlamaIndex and LangGraph — compare ergonomics", desc:"Build identical functionality (ingest PDF, chunk, embed, retrieve, generate) in both frameworks. The comparison reveals which abstractions you prefer and where each framework excels." },
          { id:"i2", text:"Build a two-agent CrewAI system — researcher + writer — for a technical topic", desc:"Researcher agent retrieves and synthesises; writer agent structures into a document. Run it on a technical topic you know and evaluate the output. Fastest way to understand role-based multi-agent systems." },
          { id:"i3", text:"Rewrite an existing prompt using DSPy — measure quality before/after optimisation", desc:"Take a prompt you currently tune manually, define it as a DSPy Module with typed signatures, and run the DSPy optimiser on a small labelled dataset. Comparing human-tuned vs DSPy-optimised prompts reveals how much you were leaving on the table." },
        ],
        extraReading:[
          { id:"e1", topic:"Haystack — production-grade NLP pipelines by deepset", desc:"Haystack is built for production NLP with first-class support for document stores, custom components, and pipeline serialisation. Strong for enterprise deployments needing deterministic, auditable pipelines.", url:"https://docs.haystack.deepset.ai/" },
          { id:"e2", topic:"A2A Protocol — Agent-to-Agent communication standard from Google", desc:"Google A2A is an emerging standard for inter-agent communication, complementing MCP for tool exposure. Enables agents built on different frameworks to collaborate. Still early but worth tracking.", url:"https://developers.googleblog.com/en/a2a-a-new-era-of-agent-interoperability/" },
          { id:"e3", topic:"Instructor — structured outputs with Pydantic for any LLM", desc:"Instructor wraps any LLM (OpenAI, Anthropic, local) with Pydantic-validated structured output. Simpler than Outlines for cases where you just need reliable JSON from an API call.", url:"https://python.useinstructor.com/" },
        ]
      },
    ]
  },
  {
    phase: "Marvell Engineering Track",
    color: "#0ea5e9",
    items: [
      {
        id:"mv3", week:"Priority 1", title:"GenAI Agent Systems & Production Engineering", duration:"4–6 weeks",
        tags:["agents","langgraph","observability","async","llmops","context-engineering"],
        theory:[
          { id:"t1", text:"Context engineering — architecting what the model sees, not just the prompt", desc:"The 2024/25 shift: prompt engineering is about wording; context engineering is about structuring the full context window — which documents, memories, tool results, and conversation history to include, in what order, and at what detail level. This is the highest-leverage skill for improving agent quality in production.", resource:"LangChain — Context Engineering 2025" },
          { id:"t2", text:"Agentic patterns — ReAct, Plan-and-Execute, reflection, and multi-agent handoffs", desc:"ReAct interleaves reasoning and tool calls in a loop. Plan-and-Execute separates planning from execution for complex multi-step tasks. Reflection agents critique their own outputs before responding. Multi-agent systems delegate subtasks via handoffs. Knowing which pattern fits which problem is the core architecture skill.", resource:"Zhou et al. — Agentic AI Engineering" },
          { id:"t3", text:"LangGraph — stateful agent workflows as graphs, not linear chains", desc:"LangGraph models agent workflows as directed graphs with explicit state. Nodes are functions; edges are transitions (including conditional). Cycles enable iterative loops, retries, and human-in-the-loop checkpoints. This is the production-grade alternative to simple LangChain chains.", resource:"LangGraph Docs" },
          { id:"t4", text:"Tool/function calling design — naming, schema, and error handling", desc:"LLMs select tools probabilistically based on name and description. A poorly named tool will be ignored even if it's exactly what's needed — production teams have validated this empirically. Tool schemas should be unambiguous, descriptions should be verbose, and every tool call should handle errors gracefully with informative feedback to the model.", resource:"ZenML — 1200 Production Deployments 2025" },
          { id:"t5", text:"Agent observability — tracing every LLM call, tool call, and decision", desc:"89% of production agent teams have observability in place. Without traces, debugging non-deterministic agent failures is nearly impossible. LangSmith, Langfuse, and AgentOps all provide session replay, token tracking, latency percentiles, and LLM-as-judge scoring. OpenTelemetry is the open standard underpinning most.", resource:"LangChain — State of Agent Engineering 2025" },
          { id:"t6", text:"LLM-as-judge evaluation — scaling quality assessment beyond human review", desc:"Agents are non-deterministic — you can't evaluate them with accuracy metrics. LLM-as-judge uses a separate LLM to score responses on dimensions like correctness, relevance, and hallucination rate. Combine with human review for high-stakes cases. This is how you close the loop from production monitoring to system improvement.", resource:"LangChain — State of Agent Engineering 2025" },
          { id:"t7", text:"Async Python for agents — concurrent LLM and tool calls", desc:"Agents make many simultaneous I/O calls — multiple LLM requests, tool calls to external APIs, vector DB lookups. Synchronous code serialises all of this and is orders of magnitude slower. Async Python (asyncio, aiohttp) and concurrent execution in LangGraph are essential for production-grade agent latency.", resource:"Python asyncio docs" },
          { id:"t8", text:"Memory architecture — short-term, long-term, episodic, and semantic", desc:"Short-term memory is the context window. Long-term memory is a vector DB or database persisted across sessions. Episodic memory recalls past interactions. Semantic memory stores factual knowledge. Choosing the right memory tier for a given agent determines whether it can maintain coherent state over extended tasks.", resource:"Lilian Weng — Agent Memory Survey" },
          { id:"t9", text:"Prompt injection and agent security — tool sandboxing and guardrails architecture", desc:"Agents that browse the web, execute code, or call external APIs are vulnerable to prompt injection — malicious content in retrieved context hijacking the agent's actions. Guardrails need to validate both inputs and outputs; tool execution should be sandboxed; sensitive operations need confirmation steps.", resource:"OWASP LLM Top 10" },
          { id:"t10", text:"MCP (Model Context Protocol) — standard interface for exposing tools and data to agents", desc:"MCP is Anthropic's open protocol for connecting agents to external services. It standardises how tools, prompts, and data sources are declared and called — equivalent to what REST did for web APIs. Major SaaS tools are now shipping MCP servers, making it the fastest-growing integration pattern for agent systems.", resource:"Anthropic MCP Docs" },
          { id:"t11", text:"REST API design and async serving — FastAPI, SSE, and WebSocket for streaming", desc:"Most agent backends expose REST APIs. Streaming agent output requires server-sent events (SSE) or WebSocket — returning tokens as they arrive rather than waiting for the full response. FastAPI is the standard for Python agent backends: async-native, pydantic validation, and auto-generates OpenAPI docs.", resource:"FastAPI Docs" },
          { id:"t12", text:"Production failure modes for agents — when and why they break", desc:"The common agent failure modes: tool calling hallucinations (invoking tools with wrong parameters), context window overflow (losing important early context), reasoning loops (agent stuck cycling without progress), cascading failures in multi-agent systems, and silent quality degradation as models are updated upstream.", resource:"ZenML — 1200 Production Deployments 2025" },
        ],
        resources:[
          { id:"r1", text:"LangGraph Documentation — Agent Workflows (docs)", url:"https://langchain-ai.github.io/langgraph/", type:"docs" },
          { id:"r2", text:"State of Agent Engineering 2025 — LangChain Survey (blog)", url:"https://www.langchain.com/state-of-agent-engineering", type:"blog" },
          { id:"r3", text:"What 1200 Production Deployments Reveal — ZenML 2025 (blog)", url:"https://www.zenml.io/blog/what-1200-production-deployments-reveal-about-llmops-in-2025", type:"blog" },
          { id:"r4", text:"Langfuse — Open-source LLM observability (docs)", url:"https://langfuse.com/docs", type:"docs" },
          { id:"r5", text:"OWASP LLM Top 10 — Security risks for LLM applications (docs)", url:"https://owasp.org/www-project-top-10-for-large-language-model-applications/", type:"docs" },
          { id:"r6", text:"Anthropic MCP Documentation (docs)", url:"https://modelcontextprotocol.io/introduction", type:"docs" },
          { id:"r7", text:"Stanford CS329S — Designing ML Systems, Chip Huyen's free course slides + readings", url:"https://stanford-cs329s.github.io/", type:"course" },
        
          { id:"r_ey", text:"Eugene Yan — Applied ML blog (eugeneyan.com) (blog)", url:"https://eugeneyan.com/", type:"blog" },
          { id:"r_hh", text:"Hamel Husain — LLM evaluation in practice (blog)", url:"https://hamel.dev/blog/posts/evals/", type:"blog" },],
        implementation:[
          { id:"i1", text:"Build a stateful multi-step agent in LangGraph — with memory and tool use", desc:"Build an agent that uses at least two tools, maintains state across steps, and handles tool call errors gracefully. Use LangGraph's conditional edges to implement a retry loop when a tool call fails. This is the minimum viable production agent pattern." , megaProject:{proj:"B",step:4}},
          { id:"i2", text:"Set up Langfuse or LangSmith — trace a multi-tool agent run end-to-end", desc:"Instrument your LangGraph agent with Langfuse. Run 10 queries, examine the traces, identify the slowest step and the step with the most token usage. This is what production agent debugging looks like." },
          { id:"i3", text:"Build an LLM-as-judge eval pipeline for your agent — score 50 outputs automatically", desc:"Write a judge prompt that evaluates your agent's outputs on correctness and relevance. Run it over 50 sampled agent responses. Calculate pass rates. This closes the feedback loop from production to improvement." , megaProject:{proj:"B",step:5}},
          { id:"i4", text:"Implement context engineering on a RAG agent — compare naive vs engineered context", desc:"Take a RAG agent, then deliberately engineer the context: rerank retrieved chunks, add a summary of conversation history, inject relevant metadata. Measure answer quality before and after. The gap is your context engineering gain." },
          { id:"i5", text:"Expose a FastAPI endpoint for your agent with SSE streaming", desc:"Wrap a LangGraph agent in a FastAPI app that streams tokens via server-sent events. Test with curl and a simple HTML frontend. This is the complete production serving pattern for agent backends." , megaProject:{proj:"B",step:6}},
          { id:"i6", text:"Design a multi-agent system on paper — identify failure modes before building", desc:"Design a two-agent system (orchestrator + specialist) for a problem you know. Write out: state schema, tool schemas, handoff conditions, error recovery, observability hooks. The design exercise reveals gaps before you hit them in code." },
        ],
        extraReading:[
          { id:"e1", topic:"Context engineering deep dive — LangChain 2025 state of the field", desc:"LangChain's analysis of how the best production teams architect context: dynamic retrieval, summarisation of old turns, structured memory injection, and tool result truncation. The single most useful read for improving agent quality.", url:"https://blog.langchain.com/context-engineering-for-agents/" },
          { id:"e2", topic:"Responsible agent architecture — Swiss cheese model for AI safety", desc:"Multi-layered guardrails design: input validation, context sanitisation, output filtering, and tool execution sandboxing. No single layer is sufficient — the goal is redundancy. Directly applicable to any production agent system.", url:"https://arxiv.org/abs/2408.02205" },
          { id:"e3", topic:"CodeAct — using Python code as the action space instead of JSON tool calls", desc:"CodeAct replaces JSON function calls with Python code executed by an interpreter. This eliminates parameter hallucination (a major source of tool call failures) and gives the agent a vastly richer action space. Understanding this pattern is increasingly relevant as agents become more autonomous.", url:"https://arxiv.org/abs/2402.01030" },
          { id:"e4", topic:"ML system design interview — end-to-end framework for any ML system question", desc:"Covers the pattern: clarify requirements → data pipeline → model selection + justification → serving architecture → monitoring + failure modes. Knowing this structure lets you approach any ML system design question systematically and credibly.", url:"https://www.educative.io/blog/ml-system-design-interview" },
        ]
      },
      {
        id:"mv2", week:"Priority 2", title:"Advanced LLM Engineering — Better-to-Knows", duration:"3–4 weeks",
        tags:["long-context","structured-output","multimodal","routing","fine-tuning","embedding"],
        theory:[
          { id:"t1", text:"Long-context strategies — RAG vs extended context window, tradeoffs", desc:"LLMs now support 128K-1M token context windows, which seems to make RAG obsolete. In practice, very long contexts suffer from lost-in-the-middle failures (models ignore information in the middle) and high cost. The Marvell use case — querying large Verilog codebases and EDA documentation — is exactly where this tradeoff is live.", resource:"Lost in the Middle — Liu et al. 2023" },
          { id:"t2", text:"Structured outputs and constrained decoding — reliable JSON from LLMs", desc:"Asking an LLM to output JSON is unreliable. Constrained decoding (Outlines, llguidance) mathematically enforces a JSON schema by masking invalid tokens at every generation step — the output is guaranteed to parse. This is the production-grade approach for any pipeline that downstream-processes LLM output.", resource:"Outlines Library Docs" },
          { id:"t3", text:"Embedding models — selection, domain adaptation, fine-tuning", desc:"General embeddings (OpenAI ada, BGE, E5) work well broadly. Domain-specific vocabularies — chip design terms, EDA jargon, Verilog syntax — are often poorly represented. Sentence-transformer fine-tuning on domain pairs consistently improves retrieval quality by 5-15% for specialised domains. The MTEB benchmark is the standard for model selection.", resource:"MTEB Benchmark — HuggingFace" },
          { id:"t4", text:"Model routing and cascading — route to the right model per query", desc:"Not every query needs GPT-4o. A fast small model (Phi-3, Gemma-2B) can classify the query and route simple ones to a cheap model, complex ones to a capable one. Cascading escalates to larger models only when smaller ones signal low confidence. Production teams report 40-70% cost reduction with no quality regression.", resource:"FrugalGPT — Chen et al. 2023" },
          { id:"t5", text:"Prompt compression — LLMLingua and token-efficient context packing", desc:"Long retrieved contexts cost tokens and can overwhelm smaller models. LLMLingua uses a small language model to score and prune tokens from the context, preserving the highest-information content. Achieves 3-20x compression with minimal answer quality loss — critical for long Verilog files or large EDA documentation.", resource:"LLMLingua — Jiang et al. 2023" },
          { id:"t6", text:"Multimodal LLMs — vision-language models and document understanding", desc:"Many internal documents, chip diagrams, and data sheets exist as PDFs with embedded images, tables, and figures. Vision-language models (GPT-4V, Claude 3, LLaVA) can directly process these. Document understanding pipelines (OCR + layout detection + LLM) are increasingly how enterprises extract information from unstructured technical documents.", resource:"LLaVA Paper — Liu et al. 2023" },
          { id:"t7", text:"Fine-tuning decision tree — when RAG isn't enough", desc:"The practical decision: use RAG when the problem is knowledge (what the model knows), use fine-tuning when the problem is behaviour (how the model responds). Fine-tuning is warranted when you need consistent output format, domain-specific tone, or the model consistently fails on a class of inputs despite good retrieval. LoRA makes the barrier low enough to try quickly.", resource:"Chip Huyen — When to Fine-tune" },
          { id:"t8", text:"Mixed precision and AMP — what happens inside fine-tuning", desc:"When you fine-tune with LoRA, training runs in BF16/FP16 with FP32 master weights. BF16 has the same exponent range as FP32 (no overflow) with less mantissa precision — preferred for training stability over FP16. AMP (automatic mixed precision) handles the precision casting automatically. Knowing this helps you debug NaN losses and choose precision settings for your hardware.", resource:"NVIDIA AMP Docs" },
          { id:"t9", text:"FlashAttention — IO-aware attention for long-context fine-tuning and inference", desc:"Standard attention writes the full n×n attention matrix to HBM (slow). FlashAttention tiles the computation to stay in SRAM, reducing memory reads/writes significantly. This enables fine-tuning and inference at much longer context lengths than would otherwise fit. You'll encounter it in every serious fine-tuning codebase.", resource:"Dao et al. 2022 — FlashAttention" },
          { id:"t10", text:"Evaluation-driven iteration — golden test sets, regression testing, A/B model comparison", desc:"When you swap the base model, change chunking strategy, or update the retrieval pipeline, you need to know immediately if quality regressed. A golden test set of 50-200 representative queries with reference answers, scored by LLM-as-judge, is the engineering tool that closes this loop. Without it, every change is a leap of faith.", resource:"Hamel Husain — Evals blog" },
        ],
        resources:[
          { id:"r1", text:"Lost in the Middle — Liu et al. 2023 (paper)", url:"https://arxiv.org/abs/2307.03172", type:"paper" },
          { id:"r2", text:"Outlines — Structured Text Generation (docs)", url:"https://dottxt-ai.github.io/outlines/", type:"docs" },
          { id:"r3", text:"LLMLingua — Prompt Compression (paper)", url:"https://arxiv.org/abs/2310.05736", type:"paper" },
          { id:"r4", text:"FrugalGPT — Chen et al. 2023 (paper)", url:"https://arxiv.org/abs/2305.05176", type:"paper" },
          { id:"r5", text:"MTEB Leaderboard — Embedding Model Benchmarks (docs)", url:"https://huggingface.co/spaces/mteb/leaderboard", type:"docs" },
          { id:"r6", text:"FlashAttention Paper — Dao et al. 2022 (paper)", url:"https://arxiv.org/abs/2205.14135", type:"paper" },
        ],
        implementation:[
          { id:"i1", text:"Test lost-in-the-middle on a long Verilog or documentation file", desc:"Take a 20K token technical document, ask questions where the answer is at the beginning, middle, and end. Test with GPT-4o and a smaller model. Quantify the accuracy drop as answer position moves to the middle — this tells you whether you need RAG even with long context." },
          { id:"i2", text:"Add constrained decoding to an agent tool call — enforce a strict output schema", desc:"Take a tool in your LangGraph agent that currently receives free-form LLM output. Replace it with Outlines-constrained generation to a Pydantic schema. Measure the reduction in JSON parse errors before vs after — usually drops from 3-8% to 0%." },
          { id:"i3", text:"Fine-tune a sentence-transformer embedding model on domain-specific pairs", desc:"Create 200 (query, relevant_passage) pairs from your domain. Fine-tune a sentence-transformer model on them. Measure retrieval recall@5 before and after on a held-out set. A 5-15% improvement is typical for domain-specific vocabularies." },
          { id:"i4", text:"Implement a two-tier model router — small classifier routes to cheap vs expensive model", desc:"Train a simple classifier (or use an LLM with a scoring prompt) to classify query complexity. Route simple queries to a small local model, complex ones to GPT-4o. Measure cost per 100 queries vs quality. This is model routing in its simplest form." },
        ],
        extraReading:[
          { id:"e1", topic:"RAPTOR — recursive abstractive processing for tree-organised retrieval", desc:"RAPTOR builds a tree of summaries over a document corpus at multiple levels of abstraction. Retrieval can happen at any level — answering both specific detail questions (leaf nodes) and broad synthesis questions (root nodes). Outperforms flat RAG significantly on multi-hop questions.", url:"https://arxiv.org/abs/2401.18059" },
          { id:"e2", topic:"Agentic document parsing — ColPali and visual RAG for PDFs with figures", desc:"ColPali embeds entire PDF page images (not just extracted text) using a vision-language model. This handles figures, tables, and diagrams that text extraction destroys. Directly relevant for Marvell's technical documentation — datasheets, block diagrams, timing charts.", url:"https://arxiv.org/abs/2407.01449" },
          { id:"e3", topic:"GraphRAG — knowledge graph construction for multi-hop reasoning", desc:"GraphRAG builds a knowledge graph from documents rather than a flat vector index. Multi-hop questions (what is the relationship between X and Y in this system?) are answered by traversing the graph rather than dense retrieval. Microsoft's implementation is open-source.", url:"https://arxiv.org/abs/2404.16130" },
          { id:"e4", topic:"Embedding quantisation — binary and scalar quantised embeddings for cost reduction", desc:"Embedding vectors can themselves be quantised (to INT8 or binary) for cheaper storage and faster search. Binary quantisation with rescoring gives 32x memory reduction with only ~5% recall loss — relevant when you have millions of technical document chunks.", url:"https://huggingface.co/blog/embedding-quantization" },
        ]
      },
      {
        id:"mv1", week:"Priority 3", title:"LLM Inference & Serving — Absolute Must-Knows", duration:"3–4 weeks",
        tags:["vllm","kv-cache","quantization","onnx","serving","latency"],
        theory:[
          { id:"t1", text:"Autoregressive generation — prefill vs decode, why LLM inference is different", desc:"LLM inference has two distinct phases: prefill (processing the full prompt in parallel, compute-bound) and decode (generating one token at a time, memory-bandwidth-bound). Every serving optimisation targets one or both of these phases. Understanding this split is the foundation of everything else here.", resource:"vLLM Docs" },
          { id:"t2", text:"KV cache — what it is, why it exists, and when it fills up", desc:"During decode, the key and value tensors for all previous tokens must be recomputed or cached. KV caching stores them — trading memory for compute. KV cache grows linearly with sequence length and batch size, and is almost always the binding memory constraint in LLM serving. When it fills up, throughput collapses.", resource:"vLLM — PagedAttention Blog" },
          { id:"t3", text:"vLLM and PagedAttention — continuous batching and memory management", desc:"Standard serving frameworks pre-allocate a fixed KV cache block per request, wasting most of it. PagedAttention manages KV cache like OS virtual memory — allocating in pages, enabling sharing across requests. Combined with continuous batching (adding new requests as slots free up), vLLM achieves 10-24x throughput over naive serving.", resource:"vLLM — PagedAttention Blog" },
          { id:"t4", text:"Quantization for LLM serving — INT4/INT8/FP8, PTQ vs QAT", desc:"Quantization reduces weight precision from FP16 to INT4/INT8/FP8. For small batch inference (batch ≤ 4), the bottleneck is memory bandwidth — weight-only quantization (GPTQ, AWQ) helps most. For large batch serving (batch ≥ 16), both weights and activations should be quantized. FP8 is now the production standard on H100.", resource:"TensorRT-LLM Quantization Guide" },
          { id:"t5", text:"GPTQ and AWQ — practical post-training quantization for LLMs", desc:"GPTQ quantizes to 4-bit using second-order Hessian information per layer. AWQ identifies the ~1% of weights that matter most (based on activation magnitudes) and protects them during quantization. Both achieve near-FP16 quality at 4-bit — the standard recipe for deploying local LLMs on limited GPU memory.", resource:"GPTQ/AWQ papers" },
          { id:"t6", text:"ONNX and the model export pipeline — framework → runtime → hardware", desc:"ONNX is the standard interchange format between training frameworks (PyTorch) and inference runtimes (ONNX Runtime, TensorRT). The pipeline: train → export to ONNX → optimise → run on target hardware. For Marvell, ONNX Runtime's execution providers let the same model target different hardware backends.", resource:"ONNX Runtime Docs" },
          { id:"t7", text:"TensorRT-LLM — NVIDIA's production LLM inference stack", desc:"TensorRT-LLM combines the ONNX→TRT compilation pipeline with LLM-specific optimisations: in-flight batching, paged KV cache, quantization, and tensor parallelism. This is the production stack for deploying LLMs on NVIDIA hardware at Marvell and most data centres. Understand the compilation workflow and the precision tradeoffs.", resource:"TensorRT-LLM Docs" },
          { id:"t8", text:"Semantic caching — cache LLM responses by query similarity, not exact match", desc:"Exact-match caching misses nearly everything for LLMs. Semantic caching stores (embedding, response) pairs and returns cached responses for semantically similar queries. Redis with vector similarity is the standard stack. Production teams report 150-400x speedup on repeat patterns — the highest-leverage cost optimisation in many systems.", resource:"Redis Semantic Cache Docs" },
          { id:"t9", text:"Model selection framework — API vs local, big vs small, cost vs quality", desc:"The practical decision tree every GenAI engineer needs: use API models (GPT-4o, Claude) for high-quality complex tasks; local quantised models (Llama, Mistral via vLLM) for high-volume, cost-sensitive, or privacy-constrained tasks; small models (Phi-3, Gemma 2B) for classification/routing. The wrong model choice is the most common production cost mistake.", resource:"a16z — LLM cost analysis" },
          { id:"t10", text:"FLOP and memory footprint estimation — back-of-envelope for any model", desc:"Being able to estimate FLOPs and memory for any model in 60 seconds is a core engineering skill — it tells you whether a model fits on a given GPU before you write a line of code. Rule of thumb: a B-parameter model in FP16 needs ~2B GB of GPU memory for weights alone; add ~1-2x for KV cache and activations.", resource:"Horace He — Making DL Go Brrr" },
          { id:"t11", text:"Knowledge distillation — training a small model to mimic a large one", desc:"Distillation trains a small student to match a large teacher's output logits (not just hard labels). The soft targets carry much more information. Used to compress large fine-tuned models to deployable sizes. Relevant when you've fine-tuned a large model and need to productionise it on constrained hardware.", resource:"Hinton et al. 2015" },
        ],
        resources:[
          { id:"r1", text:"vLLM PagedAttention Blog — Kwon et al. 2023 (blog)", url:"https://vllm.ai/blog/2023/06/20/vllm.html", type:"blog" },
          { id:"r2", text:"TensorRT-LLM Quantization Guide — NVIDIA (docs)", url:"https://nvidia.github.io/TensorRT-LLM/blogs/quantization-in-TRT-LLM.html", type:"docs" },
          { id:"r3", text:"AWQ Paper — Lin et al. 2023 (paper)", url:"https://arxiv.org/abs/2306.00978", type:"paper" },
          { id:"r4", text:"ONNX Runtime Documentation (docs)", url:"https://onnxruntime.ai/docs/", type:"docs" },
          { id:"r5", text:"LLM Inference Handbook — BentoML (blog)", url:"https://bentoml.com/llm/getting-started/llm-quantization", type:"blog" },
          { id:"r6", text:"Making Deep Learning Go Brrrr — Horace He (blog)", url:"https://horace.io/brrr_intro.html", type:"blog" },
        ],
        implementation:[
          { id:"i1", text:"Serve a local Llama or Mistral model with vLLM — benchmark throughput vs naive serving", desc:"Get vLLM running, send concurrent requests, and compare tokens/sec against a naive huggingface pipeline. The throughput difference from continuous batching alone is usually 5-10x — seeing it on your own machine makes it concrete." },
          { id:"i2", text:"Quantize a 7B model with AWQ and compare quality vs FP16 on 20 test prompts", desc:"Use the AutoAWQ library to quantize a Mistral-7B to INT4. Run the same 20 prompts on FP16 and INT4 and compare outputs. Measure GPU memory usage — you should see ~4x reduction with minimal quality loss." },
          { id:"i3", text:"Export a small transformer to ONNX and run with ONNX Runtime — measure latency vs PyTorch", desc:"Export a BERT or DistilBERT model via torch.onnx.export, run with ONNX Runtime, and measure inference latency. This teaches the full ONNX pipeline and gives you intuition for when the export overhead is worth it." },
          { id:"i4", text:"Implement semantic caching on a RAG pipeline — measure cache hit rate on 100 queries", desc:"Add a Redis + vector similarity semantic cache layer to your RAG agent. Run 100 queries with natural variation (e.g., 'What is X' vs 'Explain X' vs 'Tell me about X') and measure the cache hit rate. Build intuition for when caching is and isn't effective." },
        ],
        extraReading:[
          { id:"e1", topic:"Speculative decoding — draft model + verifier for faster generation", desc:"A small fast draft model generates candidate tokens; the large model verifies them in parallel in a single forward pass. 2-3x generation speedup with identical output distribution. Now integrated into vLLM and TensorRT-LLM — increasingly the default for latency-sensitive serving.", url:"https://arxiv.org/abs/2211.17192" },
          { id:"e2", topic:"Continuous batching deep dive — why static batching wastes GPU compute", desc:"Static batching waits for the longest sequence before returning any result. Continuous batching inserts new requests as decode slots free up. The throughput improvement is proportional to sequence length variance — which is high in production agent workloads.", url:"https://www.anyscale.com/blog/continuous-batching-llm-inference" },
          { id:"e3", topic:"KV cache quantization — INT8/FP8 KV cache for higher concurrency", desc:"Quantizing the KV cache from FP16 to FP8 or INT8 halves its memory footprint, allowing 2-3x more concurrent requests on the same hardware with minimal accuracy impact. Supported natively in TensorRT-LLM for Hopper GPUs.", url:"https://nvidia.github.io/TensorRT-LLM/blogs/quantization-in-TRT-LLM.html" },
          { id:"e4", topic:"Mixture of Experts serving — loading only activated experts", desc:"MoE models (Mixtral, DeepSeek) have 60%+ of frontier releases using sparse expert routing as of 2025. Serving them efficiently requires only loading activated expert weights to GPU — the rest can stay in CPU RAM. Understanding this is increasingly essential as MoE becomes the default architecture.", url:"https://arxiv.org/abs/2401.04088" },
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
        id:"gen1", week:"After Month 6", title:"Generative Models Deep Dive", duration:"2–3 months",
        tags:["vae","gan","diffusion","flows","generative"],
        theory:[
          { id:"t1", text:"Autoencoders — bottleneck representations, irregular latent space", desc:"Encoder compresses data to a latent code z; decoder reconstructs. The bottleneck forces compact representations, but standard autoencoders have irregular latent spaces — you can't sample meaningfully from them.", resource:"VAE paper — Kingma & Welling 2014" },
          { id:"t2", text:"VAE — encoding to a distribution and the reparameterisation trick", desc:"Instead of encoding to a point, encode to N(μ, σ²). The ELBO loss has two terms: reconstruction quality and KL regularisation toward N(0,I). The reparameterisation trick z = μ + σ⊙ε makes sampling differentiable.", resource:"VAE paper — Kingma & Welling 2014" },
          { id:"t3", text:"GAN minimax objective — generator vs discriminator equilibrium", desc:"Generator G(z) learns to produce realistic samples; discriminator D(x) learns to distinguish real from fake. At Nash equilibrium, G captures the data distribution and D is stuck at 0.5. JS divergence is minimised.", resource:"GAN paper — Goodfellow et al. 2014" },
          { id:"t4", text:"GAN training instability — mode collapse and why it happens", desc:"Mode collapse: generator finds a few modes that fool the discriminator and ignores the rest of the data distribution. Training oscillates rather than converges. Understanding this is the motivation for every GAN improvement.", resource:"WGAN paper — Arjovsky et al. 2017" },
          { id:"t5", text:"Wasserstein GAN — Earth Mover's distance replaces JS divergence", desc:"WGAN replaces JS divergence (which saturates, giving zero gradient when distributions don't overlap) with Wasserstein distance, which provides useful gradient signal everywhere. Requires enforcing a Lipschitz constraint on the critic.", resource:"WGAN paper — Arjovsky et al. 2017" },
          { id:"t6", text:"Normalizing flows — invertible transforms and exact likelihood", desc:"Apply a sequence of invertible transformations to a simple distribution. The change of variables formula gives exact log-likelihood: log p(x) = log p(z) + log|det(∂z/∂x)|. Unlike VAE/GAN, training is stable and likelihood is exact.", resource:"RealNVP — Dinh et al. 2017" },
          { id:"t7", text:"DDPM — forward noising process and learning to reverse it", desc:"Define T steps of Gaussian noise addition until data becomes pure noise. Train a UNet to predict the noise ε at each step. Sampling is iterative denoising from N(0,I). Training simplifies to: predict ε, minimise MSE against actual noise added.", resource:"DDPM — Ho et al. 2020" },
          { id:"t8", text:"Score-based / SDE perspective — diffusion as a reverse-time SDE", desc:"Song et al. unify diffusion models under SDEs. The forward process adds noise via a drift+diffusion SDE; the reverse is also an SDE driven by the score function ∇_x log p(x). This view clarifies all connections between DDPM, SMLD, and flows.", resource:"Score SDEs — Song et al. 2021" },
          { id:"t9", text:"Latent diffusion — run diffusion in VAE latent space for efficiency", desc:"Pixel-space diffusion is expensive. Encode image to a compressed latent with a VAE, run diffusion there, decode back. Cross-attention with text embeddings enables language conditioning. This is how Stable Diffusion works.", resource:"LDM — Rombach et al. 2022" },
        ],
        resources:[
          { id:"r1", text:"VAE Paper — Kingma & Welling 2014 (paper)", url:"https://arxiv.org/abs/1312.6114", type:"paper" },
          { id:"r2", text:"GAN Paper — Goodfellow et al. 2014 (paper)", url:"https://arxiv.org/abs/1406.2661", type:"paper" },
          { id:"r3", text:"WGAN Paper — Arjovsky et al. 2017 (paper)", url:"https://arxiv.org/abs/1701.07875", type:"paper" },
          { id:"r4", text:"DDPM Paper — Ho et al. 2020 (paper)", url:"https://arxiv.org/abs/2006.11239", type:"paper" },
          { id:"r5", text:"Lilian Weng — From GAN to WGAN (blog)", url:"https://lilianweng.github.io/posts/2017-08-20-gan/", type:"blog" },
          { id:"r6", text:"Lilian Weng — What are Diffusion Models? (blog)", url:"https://lilianweng.github.io/posts/2021-07-11-diffusion-models/", type:"blog" },
        ],
        implementation:[
          { id:"i1", text:"Implement a VAE from scratch in PyTorch — MNIST latent space", desc:"Implement the encoder (outputs μ and log σ²), the reparameterisation trick, the decoder, and the ELBO loss. Visualise the 2D latent space and sample from it." },
          { id:"i2", text:"Implement a basic GAN — observe mode collapse deliberately", desc:"Train a GAN until it collapses to a single mode, then diagnose why. This makes mode collapse a concrete experience rather than an abstract concept." },
          { id:"i3", text:"Run Stable Diffusion locally — trace the denoising loop in code", desc:"Follow the diffusion sampling step through the actual code: UNet call, noise prediction, scheduler step, VAE decode. Demystifies what inference is actually doing." },
        ],
        extraReading:[
          { id:"e1", topic:"Progressive GAN / StyleGAN — growing resolution and style mixing", desc:"Progressive GAN stabilises high-resolution training by growing the network incrementally from 4×4 to 1024×1024. StyleGAN adds a style-based generator with AdaIN normalisation, enabling disentangled control over coarse and fine features.", url:"https://arxiv.org/abs/1812.04948" },
          { id:"e2", topic:"WGAN-GP — gradient penalty as Lipschitz enforcement", desc:"WGAN requires the critic to be 1-Lipschitz. Weight clipping (original WGAN) causes gradient flow issues; WGAN-GP instead penalises the gradient norm directly — cleaner and more stable.", url:"https://arxiv.org/abs/1704.00028" },
          { id:"e3", topic:"Score matching — training score functions without normalising constants", desc:"Score matching trains ∇_x log p(x) directly by minimising Fisher divergence, bypassing the intractable partition function. This is the theoretical foundation of diffusion model training.", url:"https://jmlr.org/papers/v6/hyvarinen05a.html" },
          { id:"e4", topic:"DDIM — deterministic sampling for faster diffusion inference", desc:"DDIM reformulates DDPM as a non-Markovian process, enabling deterministic sampling in 10–50 steps instead of 1000 with minimal quality loss — the practical technique used in most deployed diffusion systems.", url:"https://arxiv.org/abs/2010.02502" },
        ]
      },
      {
        id:"ssl1", week:"After Month 7", title:"Self-Supervised & Representation Learning", duration:"2–3 months",
        tags:["contrastive","ssl","embeddings","dino","mae"],
        theory:[
          { id:"t1", text:"Why representations matter — linear probing and transfer quality", desc:"A good representation makes downstream tasks linearly separable. Linear probe accuracy on frozen features is the standard metric. The goal: invariance to semantically irrelevant transforms, sensitivity to relevant ones.", resource:"SimCLR — Chen et al. 2020" },
          { id:"t2", text:"Contrastive learning — NT-Xent loss and the role of negatives", desc:"Create two augmented views of the same image. Push their representations together (positive pair) and push all other images apart (negative pairs). NT-Xent loss implements this over a batch with temperature τ controlling distribution sharpness.", resource:"SimCLR — Chen et al. 2020" },
          { id:"t3", text:"MoCo — momentum encoder and a queue of negatives", desc:"Contrastive learning needs many negatives. MoCo maintains a queue of past encodings and uses a slowly momentum-updated encoder for stability — decoupling the number of negatives from batch size.", resource:"MoCo — He et al. 2020" },
          { id:"t4", text:"Representation collapse — the fundamental failure mode of SSL", desc:"Naive self-supervised models collapse — the network learns to output the same constant vector for everything, which minimises any contrastive loss trivially. Every SSL technique is fundamentally a solution to this problem.", resource:"BYOL — Grill et al. 2020" },
          { id:"t5", text:"BYOL — no negatives, stop-gradient and a predictor head", desc:"BYOL uses only positive pairs (no negatives) and avoids collapse via an asymmetric design: an online network with a predictor head trained against a momentum target. Why this works without collapse remained mysterious for months.", resource:"BYOL — Grill et al. 2020" },
          { id:"t6", text:"Barlow Twins — redundancy reduction as an anti-collapse objective", desc:"Instead of contrastive pairs, Barlow Twins computes the cross-correlation matrix of two views and pushes it toward the identity matrix — maximising feature informativeness while minimising redundancy between dimensions.", resource:"Barlow Twins — Zbontar et al. 2021" },
          { id:"t7", text:"DINO — self-distillation with emergent segmentation properties", desc:"Student processes local crops; teacher (momentum-updated) processes global views. Student trained to match teacher softmax. Remarkably, attention heads spontaneously learn to segment objects — never explicitly trained to do so.", resource:"DINO — Caron et al. 2021" },
          { id:"t8", text:"MAE — mask 75% of image patches, reconstruct in pixel space", desc:"Mask the majority of ViT patches randomly and train to reconstruct them. High masking ratio forces the model to learn global structure rather than local texture. Encoder only sees visible patches — computationally very efficient.", resource:"MAE — He et al. 2022" },
        ],
        resources:[
          { id:"r1", text:"SimCLR Paper — Chen et al. 2020 (paper)", url:"https://arxiv.org/abs/2002.05709", type:"paper" },
          { id:"r2", text:"BYOL Paper — Grill et al. 2020 (paper)", url:"https://arxiv.org/abs/2006.07733", type:"paper" },
          { id:"r3", text:"DINO Paper — Caron et al. 2021 (paper)", url:"https://arxiv.org/abs/2104.14294", type:"paper" },
          { id:"r4", text:"MAE Paper — He et al. 2022 (paper)", url:"https://arxiv.org/abs/2111.06377", type:"paper" },
          { id:"r5", text:"Lilian Weng — Self-Supervised Representation Learning (blog)", url:"https://lilianweng.github.io/posts/2021-05-31-contrastive/", type:"blog" },
        ],
        implementation:[
          { id:"i1", text:"Implement NT-Xent contrastive loss from scratch", desc:"Writing the loss yourself — pairwise similarities, temperature scaling, softmax over negatives — makes it concrete. Test on CIFAR-10 with two augmented views." },
          { id:"i2", text:"Train a minimal SimCLR — linear probe to evaluate representations", desc:"After training with NT-Xent, freeze the encoder and train a single linear layer on labels. Compare linear probe accuracy to fully supervised — the gap is your representation quality metric." },
          { id:"i3", text:"Visualise DINO attention maps on your own images", desc:"DINO's pretrained ViT attention heads produce remarkably clean segmentation-like visualisations. Running this on your own images is one of the most striking demonstrations of emergent behaviour in DL." },
        ],
        extraReading:[
          { id:"e1", topic:"Information bottleneck — maximise I(Z;Y), minimise I(Z;X)", desc:"The information bottleneck principle formalises what a good representation does: compress away task-irrelevant information (minimise I(Z;X)) while retaining task-relevant information (maximise I(Z;Y)).", url:"https://arxiv.org/abs/1703.00810" },
          { id:"e2", topic:"Alignment and uniformity — geometric decomposition of contrastive loss", desc:"Wang & Isola decompose contrastive loss into alignment (positive pairs should be close) and uniformity (representations should be spread uniformly on the hypersphere). This geometric view explains why contrastive learning works.", url:"https://arxiv.org/abs/2005.10242" },
          { id:"e3", topic:"DINOv2 — curated data and distillation for stronger visual features", desc:"DINOv2 scales DINO with careful data curation and self-distillation, producing features that match or beat supervised models on many benchmarks — demonstrating that data quality matters as much as architecture.", url:"https://arxiv.org/abs/2304.07193" },
          { id:"e4", topic:"VICReg — variance, invariance, covariance regularisation", desc:"VICReg provides a clean decomposition: invariance term pulls positive pairs together, variance term prevents collapse by enforcing non-degenerate activations, covariance term decorrelates dimensions.", url:"https://arxiv.org/abs/2105.04906" },
        ]
      },
      {
        id:"opt1", week:"After Month 8", title:"Optimisation & Training Dynamics", duration:"2 months",
        tags:["sgd","adam","loss landscape","generalization","theory"],
        theory:[
          { id:"t1", text:"Adam — momentum + adaptive per-parameter learning rates", desc:"Adam maintains a momentum estimate m_t and a second-moment estimate v_t per parameter. The adaptive learning rate η/√v̂_t automatically scales updates — larger for sparse parameters, smaller for frequent ones. Bias correction prevents the initial steps from being too small.", resource:"Adam paper — Kingma & Ba 2015" },
          { id:"t2", text:"Saddle points vs local minima — why local minima are rare in high dimensions", desc:"In high dimensions, a critical point requires all eigenvalues of the Hessian to be positive simultaneously. The probability of this is exponentially small — most critical points are saddle points. SGD noise naturally escapes them.", resource:"Dauphin et al. 2014" },
          { id:"t3", text:"Loss landscape geometry — why ResNets are smoother than plain nets", desc:"Li et al. visualised loss surfaces in 2D filter directions. ResNets have smooth, convex-looking landscapes; plain networks without skip connections have chaotic surfaces with many barriers. This geometrically explains why residual connections help optimization, not just gradient flow.", resource:"Li et al. 2018" },
          { id:"t4", text:"Batch normalisation — loss landscape smoothing, not covariate shift", desc:"The original BatchNorm paper claimed it fixes internal covariate shift — Santurkar et al. showed this is false. The real benefit is loss landscape smoothing: BN makes the loss more Lipschitz and gradients more predictable, enabling higher learning rates.", resource:"Santurkar et al. 2018" },
          { id:"t5", text:"Implicit bias of SGD — minimum norm solutions and flat minima", desc:"SGD doesn't just find any minimum — it has a preference for flat minima (low Hessian trace), which generalise better. For linear models, gradient descent finds the minimum-norm solution. For deep networks, SAM explicitly seeks flat minima.", resource:"Foret et al. 2021 — SAM" },
          { id:"t6", text:"Double descent — why overparameterised models still generalise", desc:"Classical bias-variance says test error rises after overfitting. Double descent shows a second descent: once the model is large enough to perfectly interpolate training data, adding more parameters reduces test error again. This fundamentally contradicts classical learning theory.", resource:"Nakkiran et al. 2021" },
          { id:"t7", text:"Neural Tangent Kernel — infinite-width networks as kernel machines", desc:"In the infinite-width limit, a neural network at initialisation is equivalent to a kernel machine with the NTK kernel. Under gradient descent the kernel stays approximately constant — giving exact training dynamics analytically. A rare rigorous theoretical handle on deep networks.", resource:"Jacot et al. 2018" },
          { id:"t8", text:"Linear mode connectivity — independently trained models share basins", desc:"Two independently trained networks can often be connected by a linear path in weight space with low loss throughout — their minima lie in the same loss basin. This has practical implications for model merging and federated learning.", resource:"Frankle et al. 2020" },
        ],
        resources:[
          { id:"r1", text:"Adam Paper — Kingma & Ba 2015 (paper)", url:"https://arxiv.org/abs/1412.6980", type:"paper" },
          { id:"r2", text:"Visualizing Loss Landscapes — Li et al. 2018 (paper)", url:"https://arxiv.org/abs/1712.09913", type:"paper" },
          { id:"r3", text:"Deep Double Descent — Nakkiran et al. 2021 (paper)", url:"https://arxiv.org/abs/1912.02292", type:"paper" },
          { id:"r4", text:"NTK Paper — Jacot et al. 2018 (paper)", url:"https://arxiv.org/abs/1806.07572", type:"paper" },
          { id:"r5", text:"Sebastian Ruder — Overview of Gradient Descent Algorithms (blog)", url:"https://ruder.io/optimizing-gradient-descent/", type:"blog" },
        ],
        implementation:[
          { id:"i1", text:"Implement Adam from scratch — verify against PyTorch's Adam", desc:"Code the momentum and second-moment accumulators, bias correction, and parameter update. Run on Week 1 linear regression and confirm identical results to torch.optim.Adam." },
          { id:"i2", text:"Visualise the loss landscape of a small network in 2D filter directions", desc:"Use the filter normalisation technique from Li et al. — plot the loss surface along two random directions from a trained checkpoint. Compare ResNet vs plain network visually." },
          { id:"i3", text:"Demonstrate double descent on a small model", desc:"Train a polynomial regression model of increasing degree on a small dataset, plot train and test error — you should see the classical U-shape, then a dip back down after interpolation threshold." },
        ],
        extraReading:[
          { id:"e1", topic:"SAM — sharpness-aware minimisation for better generalisation", desc:"SAM explicitly seeks parameters in flat loss regions by computing gradients at a worst-case perturbation of the weights. Consistently improves generalisation across architectures, at roughly 2x training cost.", url:"https://arxiv.org/abs/2010.01412" },
          { id:"e2", topic:"Edge of stability — learning rate drives curvature to 2/η", desc:"Empirically, gradient descent training converges to a regime where the maximum curvature of the loss ≈ 2/learning_rate, independent of architecture. This 'edge of stability' phenomenon challenges classical optimisation theory.", url:"https://arxiv.org/abs/2103.00065" },
          { id:"e3", topic:"Lottery ticket hypothesis — sparse subnetworks that train from scratch", desc:"Frankle & Carlin found that dense networks contain sparse subnetworks (winning tickets) that, when rewound to their original initialisation and retrained alone, match full network performance — suggesting initialisation matters enormously.", url:"https://arxiv.org/abs/1803.03635" },
          { id:"e4", topic:"Grokking — delayed generalisation after perfect training accuracy", desc:"Power et al. observed that small transformers trained on modular arithmetic achieve perfect training accuracy quickly, then generalise only much later after continued training — a mysterious phenomenon that reveals something deep about the optimisation geometry.", url:"https://arxiv.org/abs/2201.02177" },
        ]
      },
      {
        id:"ra_frontier", week:"Month 6–8", title:"How Frontier Models Are Built and Differ", duration:"3–4 weeks",
        tags:["gpt","claude","gemini","deepseek","pretraining","alignment","tokenization"],
        theory:[
          { id:"t1", text:"The standard LLM training pipeline — pretraining, SFT, RLHF/DPO", desc:"All frontier models follow the same broad pipeline: unsupervised pretraining on massive text, supervised fine-tuning on curated instructions, and alignment via RLHF or DPO. Understanding each phase is the prerequisite for reasoning about any specific model's behaviour.", resource:"InstructGPT — Ouyang et al. 2022" },
          { id:"t2", text:"Pretraining data — scale, curation, deduplication, contamination", desc:"GPT-4 was trained on ~13T tokens; Llama 3 on 15T. Data quality beats quantity beyond a point. Deduplication (MinHash), quality filtering (classifier-based), and contamination detection (n-gram overlap with benchmarks) are the key engineering problems.", resource:"Stanford CS336 — Lectures 13-14" },
          { id:"t3", text:"GPT — decoder-only, next-token prediction, emergent abilities", desc:"GPT models use a decoder-only transformer with causal masking, trained purely on next-token prediction. GPT-3 demonstrated emergent few-shot learning; GPT-4 added multimodality. One simple objective scales to produce remarkably general models.", resource:"GPT-4 Technical Report 2023" },
          { id:"t4", text:"Claude — Constitutional AI, harmlessness-helpfulness balance, long context", desc:"Anthropic uses Constitutional AI: the model critiques and revises its own outputs to follow a set of principles. Claude 3 extended context to 200K tokens. A fundamentally different alignment approach from RLHF — preference learning through self-critique rather than human labellers.", resource:"Anthropic Constitutional AI Paper" },
          { id:"t5", text:"Gemini — native multimodality and mixture-of-experts at scale", desc:"Gemini was designed multimodal from scratch, processing interleaved image, audio, video, and text natively. Gemini Ultra uses sparse MoE, activating only a subset of the model per token — dramatically increasing model capacity without proportional compute cost.", resource:"Gemini Technical Report 2023" },
          { id:"t6", text:"DeepSeek — MoE efficiency, RL for reasoning, open weights", desc:"DeepSeek-V3 uses Multi-head Latent Attention (MLA) to compress the KV cache and fine-grained MoE routing — achieving GPT-4 level performance at dramatically lower inference cost. DeepSeek-R1 uses GRPO for reasoning without supervised chain-of-thought data.", resource:"DeepSeek-V3 Technical Report 2024" },
          { id:"t7", text:"Tokenisation — BPE, WordPiece, SentencePiece, and why it matters", desc:"All text is converted to integers before an LLM sees it. BPE merges frequent byte pairs iteratively. The tokeniser choice affects multilingual performance, code quality, arithmetic ability, and context efficiency. CS336 implements BPE from scratch.", resource:"Stanford CS336 — Lecture 1" },
          { id:"t8", text:"Reasoning models — chain-of-thought, o1/o3, RL-trained extended thinking", desc:"OpenAI o1 uses RL to train extended chain-of-thought reasoning at test time. The model generates a long internal reasoning trace before producing the final answer. A fundamentally different compute profile from standard generation — more tokens, same model.", resource:"OpenAI o1 System Card 2024" },
          { id:"t9", text:"Scaling laws and compute-optimal training — Chinchilla revisited", desc:"The Chinchilla result (20 tokens per parameter) was derived for a specific training budget. For inference-heavy deployments, a smaller model trained on more data is optimal — Llama's strategy. This tradeoff is how you choose the right model for a given deployment constraint.", resource:"Chinchilla — Hoffmann et al. 2022" },
        ],
        resources:[
          { id:"r1", text:"Stanford CS336 — Language Modeling from Scratch 2025 (YouTube)", url:"https://www.youtube.com/playlist?list=PLoROMvodv4rOY23Y7RVmbIDnRIJqGFRSd", type:"youtube" },
          { id:"r2", text:"GPT-4 Technical Report (paper)", url:"https://arxiv.org/abs/2303.08774", type:"paper" },
          { id:"r3", text:"DeepSeek-V3 Technical Report (paper)", url:"https://arxiv.org/abs/2412.19437", type:"paper" },
          { id:"r4", text:"Anthropic Constitutional AI paper (paper)", url:"https://arxiv.org/abs/2212.08073", type:"paper" },
          { id:"r5", text:"Lilian Weng — How to train really large LLMs (blog)", url:"https://lilianweng.github.io/posts/2021-09-25-train-large/", type:"blog" },
          { id:"r6", text:"Chinchilla — Hoffmann et al. 2022 (paper)", url:"https://arxiv.org/abs/2203.15556", type:"paper" },
        ],
        implementation:[
          { id:"i1", text:"Implement BPE tokeniser from scratch — follow CS336 Assignment 1", desc:"CS336 first assignment is a BPE tokeniser — implement merge rules, vocabulary construction, and encode/decode. This demystifies tokenisation and explains why certain inputs cost more tokens." , megaProject:{proj:"A",step:6}},
          { id:"i2", text:"Read and annotate DeepSeek-V3 and GPT-4 technical reports — extract architecture differences", desc:"Read both reports side by side. Make a table: architecture differences, training objective, data scale, alignment approach, inference cost. Trains the paper-reading skill while building a mental model of how models diverge." },
          { id:"i3", text:"Run the same 20 prompts through GPT-4o, Claude 3.5, Gemini Pro, DeepSeek — document differences", desc:"Use the same hard prompts (multi-step reasoning, code, ambiguous instructions) across all four. Differences in output style, refusal patterns, and reasoning quality are directly explained by their different alignment and architecture choices." },
        ],
        extraReading:[
          { id:"e1", topic:"Llama 3 technical report — the most detailed open frontier model report", desc:"Meta Llama 3 is unusually detailed about data curation, training infrastructure, and evaluation methodology. The most accessible window into how a frontier-scale model is actually built.", url:"https://arxiv.org/abs/2407.21783" },
          { id:"e2", topic:"Multi-head Latent Attention — DeepSeek KV cache compression", desc:"MLA projects the KV cache into a low-dimensional latent space, reducing memory by 5-13x vs standard MHA. This is the key architectural innovation making DeepSeek-V2/V3 inference-efficient.", url:"https://arxiv.org/abs/2405.04434" },
          { id:"e3", topic:"Mixture of Experts deep dive — sparse routing and expert capacity", desc:"MoE models activate only a subset of expert FFN layers per token. Understanding routing, load balancing loss, and expert capacity is increasingly essential as MoE becomes the dominant architecture.", url:"https://arxiv.org/abs/2401.04088" },
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
          { id:"e3", topic:"GNN primer — message passing, GCN, GAT, expressivity limits", desc:"Graph Neural Networks extend deep learning to relational data (molecules, social graphs, chip netlists). The key ideas: message passing aggregation, spectral vs spatial formulations, and the WL expressivity ceiling. Relevant if you touch any graph-structured data at Marvell.", url:"https://distill.pub/2021/gnn-intro/" },
          { id:"e4", topic:"GIN — achieving maximum 1-WL expressivity with sum aggregation", desc:"Xu et al. proved that mean/max aggregation is strictly less expressive than sum aggregation for graph isomorphism. GIN uses injective MLP+sum to reach the 1-WL ceiling — the theoretical foundation for understanding what GNNs can and can't distinguish.", url:"https://arxiv.org/abs/1810.00826" },
          { id:"e5", topic:"Graph Transformers — full attention over nodes with structural positional encodings", desc:"Graph Transformers apply self-attention across all node pairs (not just edges), using Laplacian eigenvectors or shortest-path distances as positional encodings. Relevant for large-scale chip design and EDA workflows.", url:"https://arxiv.org/abs/2106.05234" },
        ]
      },
    ]
  },
  {
    phase: "Scientific ML",
    color: "#10b981",
    items: [
      {
        id:"sci1", week:"Parallel Track", title:"Neural Operators & Scientific Deep Learning", duration:"2–3 months",
        tags:["neural-operators","fno","deeponet","scientific-ml","simulation"],
        theory:[
          { id:"t1", text:"Neural operators — learning maps between function spaces", desc:"Standard NNs learn functions R^n to R^m. Neural operators learn maps between function spaces: given a PDE coefficient function, output the solution function. This enables a single trained model to solve a PDE at any discretisation — not just the training grid.", resource:"FNO — Li et al. 2021" },
          { id:"t2", text:"Fourier Neural Operator (FNO) — global convolution in spectral domain", desc:"FNO applies learnable convolution in Fourier space: FFT the input function, multiply by learnable complex weights, inverse FFT. Efficiently captures long-range dependencies that local convolutions miss — critical for wave propagation, fluid dynamics, and climate modelling.", resource:"FNO — Li et al. 2021" },
          { id:"t3", text:"DeepONet — branch-trunk architecture for operator learning", desc:"DeepONet uses two sub-networks: a branch net encodes the input function at sensor points, a trunk net encodes the query locations. Their dot product gives the operator output. Grounded in the universal approximation theorem for operators.", resource:"Lu et al. 2021 — DeepONet" },
          { id:"t4", text:"Equivariant networks — encoding physical symmetries into architecture", desc:"Physical systems obey symmetries (rotation, translation, permutation). E(3)-equivariant networks encode these structurally — the model cannot violate them. Standard in molecular simulation, protein structure prediction, and materials science.", resource:"Thomas et al. 2018 — Tensor Field Networks" },
          { id:"t5", text:"Implicit neural representations — coordinate networks for continuous fields", desc:"INRs represent signals (images, volumes, 3D scenes, physics fields) as neural networks mapping coordinates to values: f(x,y,z,t) → field value. NeRF is the most famous application. For scientific ML, they enable continuous field representations not bound to a grid.", resource:"Mildenhall et al. 2021 — NeRF" },
          { id:"t6", text:"Graph neural networks for physical simulation — particles and meshes", desc:"GNS uses message-passing GNNs over particle or mesh graphs. Each node sends force messages to neighbours. This architecture underlies neural simulation surrogates for fluids, solids, and granular materials.", resource:"Sanchez-Gonzalez et al. 2020 — GNS" },
          { id:"t7", text:"Diffusion models for scientific data generation — proteins, molecules, materials", desc:"Diffusion adapted for science: DiffSBDD generates drug-like molecules, AlphaFold 3 uses diffusion for structure prediction, and new work generates crystal structures. The score function plays the role of a physics-based energy.", resource:"Jing et al. 2022 — DiffSBDD" },
          { id:"t8", text:"ML for climate and weather — GraphCast, Pangu, FourCastNet", desc:"Three independent groups achieved better-than-NWP forecast accuracy using neural operators and transformers trained on ERA5 reanalysis data. The clearest demonstration that scientific ML is production-ready for high-stakes applications.", resource:"GraphCast — Lam et al. 2023" },
          { id:"t9", text:"Foundation models for scientific ML — towards universal PDE solvers", desc:"Recent work trains large transformers on diverse PDE datasets to produce general-purpose solvers that zero-shot generalise to unseen equations. This is the direction the field is heading — scientific foundation models analogous to GPT.", resource:"Herde et al. 2024 — Poseidon" },
        ],
        resources:[
          { id:"r1", text:"FNO Paper — Li et al. 2021 (paper)", url:"https://arxiv.org/abs/2010.08895", type:"paper" },
          { id:"r2", text:"DeepONet Paper — Lu et al. 2021 (paper)", url:"https://arxiv.org/abs/1910.03193", type:"paper" },
          { id:"r3", text:"Neural Operator Survey — Kovachki et al. 2023 (paper)", url:"https://arxiv.org/abs/2108.08481", type:"paper" },
          { id:"r4", text:"GraphCast — Lam et al. 2023 (paper)", url:"https://arxiv.org/abs/2212.12794", type:"paper" },
          { id:"r5", text:"Zongyi Li — FNO Tutorial (YouTube)", url:"https://www.youtube.com/watch?v=IaS72aHrJKE", type:"youtube" },
          { id:"r6", text:"MIT 6.S191 — AI for Scientific Discovery lecture (YouTube)", url:"https://introtodeeplearning.com/", type:"course" },
        ],
        implementation:[
          { id:"i1", text:"Implement a 1D FNO from scratch — solve Burgers equation, compare to analytical solution", desc:"Implement the spectral convolution layer (FFT, weight multiplication, iFFT) in PyTorch and train on Burgers equation data. Measure relative L2 error vs the analytical solution." , megaProject:{proj:"C",step:1}},
          { id:"i2", text:"Train a GNN simulator on a simple spring-mass system — predict multi-step trajectories", desc:"Build a 1D spring-mass simulation dataset, construct a graph where masses are nodes and springs are edges, train a GNN to predict one-step acceleration, and rollout multi-step predictions." },
          { id:"i3", text:"Reproduce GraphCast inference on ERA5 data — generate a 10-day weather forecast", desc:"Use open-sourced GraphCast weights to generate a global weather forecast from ERA5 initial conditions. Visualise the result. Makes the ML-for-weather story concrete." },
        ],
        extraReading:[
          { id:"e1", topic:"AlphaFold 2 — protein structure prediction as geometry and attention", desc:"AlphaFold 2 solved a 50-year biology grand challenge using attention over amino acid pair representations and an equivariant structure module. The best example of physics constraints and deep learning working together.", url:"https://www.nature.com/articles/s41586-021-03819-2" },
          { id:"e2", topic:"Spectral bias — why NNs learn low frequencies first", desc:"NNs preferentially fit low-frequency components early in training. This creates fundamental challenges for problems with high-frequency solutions (wave equations, turbulence) and is why novel activation functions like SIREN exist.", url:"https://arxiv.org/abs/1806.08734" },
          { id:"e3", topic:"Poseidon — foundation model for PDEs, zero-shot generalisation", desc:"Poseidon trains a scalable transformer on diverse PDE datasets and demonstrates zero-shot generalisation to unseen equations. The most concrete realisation of the foundation model vision for scientific ML.", url:"https://arxiv.org/abs/2405.19101" },
          { id:"e4", topic:"Learned optimisation — using ML to learn better optimisers for scientific problems", desc:"Instead of Adam or L-BFGS, learn the update rule itself from data. For scientific inverse problems where you run the same optimisation loop thousands of times, learned optimisers can dramatically accelerate convergence.", url:"https://arxiv.org/abs/2203.00397" },
        ]
      },
      {
        id:"sci2", week:"Parallel Track", title:"AI for Drug Discovery, Materials & Biology", duration:"2–3 months",
        tags:["drug-discovery","molecular","protein","materials","genomics"],
        theory:[
          { id:"t1", text:"Molecular representation — SMILES, molecular graphs, 3D conformers", desc:"Molecules can be represented as strings (SMILES), graphs (atoms as nodes, bonds as edges), or 3D point clouds. The choice determines which architectures apply and what geometric invariances are needed.", resource:"Wieder et al. 2020 — Compact Survey" },
          { id:"t2", text:"GNNs for molecular property prediction — message passing over atom graphs", desc:"Predicting molecular properties (solubility, toxicity, binding affinity) is the canonical graph ML task. Atoms are nodes; bonds are edges; message passing aggregates neighbour information to produce a molecular-level prediction via readout.", resource:"Gilmer et al. 2017 — MPNN" },
          { id:"t3", text:"AlphaFold 2 — protein structure prediction architecture and key ideas", desc:"AlphaFold 2 uses MSA features, row/column attention over residue pair representations, and an equivariant structure module. Fundamental reading for anyone working at the biology-ML interface.", resource:"Jumper et al. 2021 — AlphaFold 2" },
          { id:"t4", text:"Generative models for molecules — SMILES-based, graph, 3D diffusion", desc:"SMILES-based autoregressive models are simple but ignore geometry. Graph-based generation builds molecules atom by atom. 3D diffusion models (DiffSBDD, EDM) generate 3D structures directly — now the dominant approach for drug design.", resource:"DiffSBDD — Schneuing et al. 2022" },
          { id:"t5", text:"Genomics and sequence ML — DNA language models, variant effect prediction", desc:"DNA and protein sequences use the same architectures as text. HyenaDNA and Nucleotide Transformer apply LLM-style pretraining to genomic sequences. Downstream tasks: variant effect prediction, regulatory element classification, gene expression.", resource:"HyenaDNA — Nguyen et al. 2023" },
        ],
        resources:[
          { id:"r1", text:"AlphaFold 2 Paper — Jumper et al. 2021 (paper)", url:"https://www.nature.com/articles/s41586-021-03819-2", type:"paper" },
          { id:"r2", text:"GNNs for Drug Discovery — practical intro (blog)", url:"https://www.blopig.com/blog/2022/02/a-practical-introduction-to-graph-neural-networks-for-drug-discovery/", type:"blog" },
          { id:"r3", text:"HuggingFace — BioML models on Hub (docs)", url:"https://huggingface.co/models?pipeline_tag=text-classification&sort=trending&search=bio", type:"docs" },
          { id:"r4", text:"Molecular ML Lectures — Valence Discovery (YouTube)", url:"https://www.youtube.com/c/ValenceDiscovery", type:"youtube" },
        ],
        implementation:[
          { id:"i1", text:"Train a GNN for molecular property prediction on QM9 — predict HOMO-LUMO gap", desc:"QM9 is the standard small molecule benchmark. Train a basic MPNN on atom-graph representations to predict the HOMO-LUMO energy gap. The hello world of molecular ML." },
          { id:"i2", text:"Fine-tune ESM-2 on HuggingFace for secondary structure prediction", desc:"ESM-2 is Meta protein language model, available on HuggingFace. Fine-tune it on secondary structure labels. Introduces the protein ML workflow and HuggingFace Hub for scientific models." },
        ],
        extraReading:[
          { id:"e1", topic:"AlphaFold 3 — diffusion for all molecular types", desc:"AlphaFold 3 extends structure prediction to arbitrary molecular complexes using a diffusion architecture. A significant architectural shift showing diffusion reach beyond images.", url:"https://www.nature.com/articles/s41586-024-07487-w" },
          { id:"e2", topic:"Active learning for drug discovery — querying experiments efficiently", desc:"Active learning selects the most informative molecules to synthesise, minimising expensive experiments. Bayesian optimisation over molecular space is the standard approach.", url:"https://arxiv.org/abs/2012.12919" },
        ]
      },
      {
        id:"sci3", week:"Parallel Track", title:"AI for Mechanical Engineering & Manufacturing", duration:"2–3 months",
        tags:["manufacturing","fea-surrogate","digital-twin","predictive-maintenance","generative-design","inspection"],
        theory:[
          { id:"t1", text:"FEA surrogate models — replacing finite element solvers with neural operators", desc:"Full FEA (ANSYS, Abaqus) for stress, deformation, and thermal fields can take minutes to hours per simulation. Neural operator surrogates (FNO, DeepONet) trained on FEA outputs can query the same solution in milliseconds with <5% error. This directly enables real-time design exploration and optimisation loops that were previously computationally infeasible.", resource:"Chen et al. 2021 — Learning FEA Surrogates" },
          { id:"t2", text:"Digital twins — physics + data fusion for live simulation of physical assets", desc:"A digital twin is a computational model of a physical asset that updates in real-time from sensor data. The ML layer handles the gap between the physics model and reality (sensor noise, unmodelled dynamics, degradation). This is the dominant paradigm in smart manufacturing, turbine monitoring, and precision machining.", resource:"Grieves & Vickers 2017 — Digital Twin" },
          { id:"t3", text:"Predictive maintenance — remaining useful life estimation from sensor time series", desc:"Predicting when a machine will fail before it does. The core ML problem: given vibration, temperature, current, and acoustic emission signals over time, estimate remaining useful life (RUL). CNN-LSTM and transformer architectures now dominate the benchmarks. The CMAPSS and PRONOSTIA datasets are the standard evaluation benchmarks.", resource:"NASA CMAPSS Dataset" },
          { id:"t4", text:"Computer vision for manufacturing inspection — defect detection and quality control", desc:"Vision-based quality inspection replaces manual inspection on production lines. Standard pipeline: high-resolution camera → CNN/ViT feature extractor → anomaly detector or classifier. Anomaly detection is preferred over pure classification because defect categories are not fully known in advance — MVTec AD is the standard benchmark.", resource:"MVTec AD Dataset — Bergmann et al. 2019" },
          { id:"t5", text:"Generative design and topology optimisation — AI-assisted structural design", desc:"Topology optimisation finds the optimal material distribution within a design space for given loads and constraints. Traditional SIMP is slow for 3D high-resolution domains. Neural network surrogates learn the optimisation landscape and generate near-optimal designs in seconds. NVIDIA Modulus and the TO-dataset are the starting points.", resource:"Nie et al. 2020 — TopologyGAN" },
          { id:"t6", text:"CFD surrogate models — learning fluid flow fields for aerodynamics and thermal management", desc:"Computational fluid dynamics (OpenFOAM, Fluent) is the other dominant computational bottleneck in mechanical design. FNO applied to CFD can predict full velocity and pressure fields at arbitrary query points from boundary conditions. Applications: HVAC design, heat exchanger optimisation, aerodynamic drag prediction.", resource:"FNO for Navier-Stokes — Li et al. 2021" },
          { id:"t7", text:"Tool wear and surface finish prediction — manufacturing process ML", desc:"In CNC machining and additive manufacturing, tool condition and process parameters (feed rate, depth of cut, spindle speed) directly determine surface roughness (Ra) and dimensional accuracy. ML models trained on cutting force signals and acoustic emission data can predict tool wear and remaining tool life — reducing scrap and unplanned downtime.", resource:"Ding et al. 2019 — Tool Wear Survey" },
          { id:"t8", text:"Graph neural networks for mesh-based simulation — FEM as a graph problem", desc:"Finite element meshes are graphs: nodes are mesh points, edges are element connections. GNNs (specifically MeshGraphNets by DeepMind) learn to simulate physics on these irregular meshes — handling variable geometry and mesh resolution, which structured grids cannot. Directly applicable to structural and fluid simulation.", resource:"Pfaff et al. 2021 — MeshGraphNets" },
          { id:"t9", text:"Anomaly detection in manufacturing — unsupervised and semi-supervised approaches", desc:"Most manufacturing defects are rare and poorly labelled — pure supervised classification fails. Unsupervised approaches (autoencoders, normalising flows, diffusion reconstruction) learn the distribution of normal parts and flag deviations. PatchCore and WinCLIP are the current state-of-the-art on MVTec. This is the dominant real-world framing in industry.", resource:"Roth et al. 2022 — PatchCore" },
          { id:"t10", text:"Reinforcement learning for process optimisation — CNC, additive manufacturing, assembly", desc:"RL agents learn optimal process parameters (or sequences) by interacting with a simulation or controlled real environment. Applications: optimising CNC toolpaths to minimise surface roughness, learning extrusion parameters in FDM 3D printing, and robotic assembly sequence optimisation. The sim-to-real gap is the main engineering challenge.", resource:"Kiran et al. 2022 — RL for Industrial Control" },
          { id:"t11", text:"Foundation models for engineering — CAD, simulation, and multimodal technical documents", desc:"Recent work applies LLMs and multimodal models directly to engineering workflows: CAD feature recognition, automated BOM extraction from drawings, natural language interfaces to FEA tools, and retrieval-augmented engineering design assistants. This is the direct intersection with your Marvell GenAI work — building AI tools for technical domains.", resource:"Makatura et al. 2023 — Generative AI for Engineering" },
        ],
        resources:[
          { id:"r1", text:"MeshGraphNets — Pfaff et al. 2021 (paper)", url:"https://arxiv.org/abs/2010.03409", type:"paper" },
          { id:"r2", text:"TopologyGAN — Nie et al. 2020 (paper)", url:"https://arxiv.org/abs/2003.04685", type:"paper" },
          { id:"r3", text:"MVTec Anomaly Detection Dataset (docs)", url:"https://www.mvtec.com/company/research/datasets/mvtec-ad", type:"docs" },
          { id:"r4", text:"NASA CMAPSS Turbofan Degradation Dataset (docs)", url:"https://data.nasa.gov/Aerospace/CMAPSS-Jet-Engine-Simulated-Data/ff5v-kuh6", type:"docs" },
          { id:"r5", text:"NVIDIA Modulus — Physics-ML framework for engineering (docs)", url:"https://docs.nvidia.com/deeplearning/modulus/index.html", type:"docs" },
          { id:"r6", text:"DeepMind MeshGraphNets — Blog and Code (blog)", url:"https://deepmind.google/discover/blog/learning-to-simulate-complex-physics-with-graph-networks/", type:"blog" },
          { id:"r7", text:"PatchCore Paper — Roth et al. 2022 (paper)", url:"https://arxiv.org/abs/2106.08265", type:"paper" },
          { id:"r8", text:"Liang et al. — Survey of ML for Manufacturing (paper)", url:"https://arxiv.org/abs/1910.07107", type:"paper" },
        ],
        implementation:[
          { id:"i1", text:"Train a CNN anomaly detector on MVTec AD — replicate PatchCore on one product category", desc:"Download MVTec AD (leather, metal nut, or transistor category — closest to manufacturing context). Train PatchCore (no labels needed — only normal training images) and evaluate AUROC on the test set. This is the full production anomaly detection pipeline used in real factories." , megaProject:{proj:"C",step:2}},
          { id:"i2", text:"Build a predictive maintenance model on NASA CMAPSS — predict RUL from sensor time series", desc:"NASA CMAPSS has multivariate time series from jet engine sensors with run-to-failure trajectories. Train a 1D-CNN or LSTM to predict remaining useful life (RUL). Evaluate RMSE and score function. This is the standard benchmark every predictive maintenance paper uses." },
          { id:"i3", text:"Train a surrogate model for a simple FEA problem — predict stress field from geometry and load", desc:"Generate 500-1000 simple 2D FEA samples (rectangle under point load — solvable analytically or with a lightweight FEA script). Train a small CNN or FNO to predict the von Mises stress field from geometry and load inputs. Compare predicted field to ground truth FEA. This is a miniature version of the industrial FEA surrogate problem." },
          { id:"i4", text:"Implement MeshGraphNets on a simple spring-mass or beam simulation", desc:"Build a 1D or 2D finite element mesh as a graph (nodes at mesh points, edges connecting neighbours). Train a GNN to predict one-step displacement updates from applied forces. Rollout multi-step simulation and compare to analytical solution. This links the graph ML work from sci1 directly to FEM." },
          { id:"i5", text:"Build a GenAI assistant for a mechanical engineering task — CAD query, material selection, or process planning", desc:"Use your Marvell GenAI skills (RAG + LLM) to build a domain-specific assistant over mechanical engineering documentation: query a material properties database, answer questions from a machining handbook, or walk through process planning from a part drawing. This directly connects your ME background to your GenAI engineering work." , megaProject:{proj:"C",step:3}},
        ],
        extraReading:[
          { id:"e1", topic:"Physics-informed neural networks for solid mechanics — stress and deformation", desc:"PINNs embed the governing equations of solid mechanics (equilibrium, compatibility, constitutive law) into the loss function. For problems where FEA mesh generation is difficult (complex geometries, crack propagation), PINNs offer a mesh-free alternative. The limitations at scale are real but the approach is valuable for understanding.", url:"https://arxiv.org/abs/2110.01002" },
          { id:"e2", topic:"Generative models for additive manufacturing — optimising print parameters with diffusion", desc:"Diffusion models and VAEs applied to FDM/SLA parameter optimisation: given a desired surface finish and strength, generate the optimal combination of layer height, infill, temperature, and speed. Early work but directly actionable for anyone with manufacturing experience.", url:"https://arxiv.org/abs/2309.07605" },
          { id:"e3", topic:"WinCLIP — zero-shot anomaly detection using vision-language models", desc:"WinCLIP uses CLIP (a vision-language model) for zero-shot industrial anomaly detection — no training images needed. The model is prompted with text descriptions of normal vs anomalous states. This bridges your GenAI background (LLMs, multimodal) with the manufacturing inspection problem.", url:"https://arxiv.org/abs/2303.14814" },
          { id:"e4", topic:"Graph networks for structural simulation — from MeshGraphNets to production", desc:"DeepMind's MeshGraphNets paper is the foundation. The follow-up work (MultiScale MeshGraphNets, BSMS-GNN) handles large meshes efficiently. Reading the sequence from MeshGraphNets to current SOTA gives you a complete view of where neural simulation for structural mechanics is heading.", url:"https://arxiv.org/abs/2109.08716" },
          { id:"e5", topic:"Digital twin platforms — Azure Digital Twins, NVIDIA Omniverse, Siemens Xcelerator", desc:"The industrial digital twin market is where most manufacturing AI is actually deployed. Understanding the platform landscape (what they provide, what you build on top) is practically useful for any ML engineer moving into industrial applications.", url:"https://blogs.microsoft.com/blog/2022/10/12/microsoft-azure-digital-twins/" },
        ]
      },
    ]
  },
  {
    phase: "Research & Applied Scientist Pivot",
    color: "#ec4899",
    items: [
      {
        id:"rp1", week:"2–3 Year Track", title:"Building a Research Portfolio for Scientist Roles", duration:"6–12 months",
        tags:["research","papers","kaggle","portfolio","conferences","huggingface","publishing"],
        theory:[
          { id:"t1", text:"The applied scientist role — half engineering, half research, full ownership", desc:"Applied Scientists spend roughly half their time productionising ML and half doing publishable research. Key distinction from ML engineer: you own the research direction. Key distinction from research scientist: your work must ship. This hybrid is the role to target in a 2-3 year horizon from a strong engineering base.", resource:"Abhishek Divekar — Engineer to Scientist" },
          { id:"t2", text:"How to read research papers — the three-pass method", desc:"Pass 1 (5 min): title, abstract, headings, conclusion — extract the main claim. Pass 2 (1 hr): read carefully, understand figures and equations. Pass 3 (4-5 hr): understand every derivation, identify assumptions and weaknesses. Most papers only warrant Pass 2.", resource:"How to Read a Paper — Keshav 2007" },
          { id:"t3", text:"Identifying a research contribution — novelty, significance, rigour", desc:"A paper contribution is one of: new method outperforming prior work on standard benchmarks, new theory explaining existing empirical observations, new dataset enabling new research, or new framework unifying existing work. Identifying which type shapes how you evaluate and write papers.", resource:"CS224N Research Project Guide" },
          { id:"t4", text:"Conference landscape — NeurIPS, ICML, ICLR, ACL, workshop papers", desc:"NeurIPS/ICML/ICLR accept both theory and empirical work; high bar but broadly respected. ACL/EMNLP prefer clean empirical NLP. Workshop papers at top conferences have 40-60% acceptance rates and are the realistic first publication target. Targeting the right venue is as important as the work.", resource:"Divekar — Notes on ML conferences" },
          { id:"t5", text:"Paper writing — structuring a contribution clearly and credibly", desc:"Abstract: 5 sentences (problem, gap, approach, result, implication). Introduction: motivation, gap, contribution, structure. Related work: position your work. Method: precisely reproducible. Experiments: ablations, statistical significance, qualitative analysis. Conclusion: do not just repeat the abstract.", resource:"Simon Peyton Jones — How to Write a Great Research Paper" },
          { id:"t6", text:"HuggingFace Hub — open science, model cards, and community visibility", desc:"Publishing code and models on HuggingFace dramatically increases citation and visibility. Papers with models on Hub get adopted faster. A detailed model card (training data, evaluation, limitations, usage) is the standard for responsible publishing and community trust.", resource:"HuggingFace — Open Science Guide" },
          { id:"t7", text:"From engineer to applied scientist — the internal transfer path", desc:"The most reliable path without a PhD: produce production impact in your engineering role, simultaneously build a research track record (workshop papers, Kaggle, open-source), then transfer internally. Internal transfer is dramatically easier than external recruiting because you have earned trust and context.", resource:"David Fan — Breaking into ML Research Without PhD" },
          { id:"t8", text:"Kaggle and competitions — building verifiable ML skills and visibility", desc:"Kaggle competitions provide labelled data, a leaderboard, and a community. A top-10% finish on a featured competition is a concrete, verifiable signal. Solo medals demonstrate capability; team medals demonstrate collaboration. The winning solution write-ups are among the best practical ML education available.", resource:"Kaggle Learn + Competition Discussions" },
        ],
        resources:[
          { id:"r1", text:"How to Read a Paper — Keshav 2007 (paper)", url:"https://web.stanford.edu/class/ee384m/Handouts/HowtoReadPaper.pdf", type:"paper" },
          { id:"r2", text:"How to Write a Great Research Paper — Simon Peyton Jones (YouTube)", url:"https://www.youtube.com/watch?v=VK51E3gHENc", type:"youtube" },
          { id:"r3", text:"Abhishek Divekar — Engineer to ML Scientist (blog)", url:"https://medium.com/@ardivekar/engineer-to-ml-scientist-notes-on-a-2-year-journey-of-growth-ed4d16d22044", type:"blog" },
          { id:"r4", text:"David Fan — Breaking into ML Research Without a PhD (blog)", url:"https://davidfan.io/blog/2022/02/breaking-into-industry-ml-ai-research-without-a-phd/", type:"blog" },
          { id:"r5", text:"HuggingFace Hub — Model and Dataset Publishing (docs)", url:"https://huggingface.co/docs/hub/index", type:"docs" },
          { id:"r6", text:"Papers with Code — track state-of-the-art results (docs)", url:"https://paperswithcode.com/", type:"docs" },
          { id:"r7", text:"Connected Papers — visualise a paper citation graph (docs)", url:"https://www.connectedpapers.com/", type:"docs" },
          { id:"r8", text:"Semantic Scholar — research discovery with citation data (docs)", url:"https://www.semanticscholar.org/", type:"docs" },
        ],
        implementation:[
          { id:"i1", text:"Reproduce one ML paper completely — train it, match reported results within 5%", desc:"Pick a paper with public code. Read it, then implement it yourself without looking at the code. Train on the same dataset. When you match within 5%, read the original code and identify differences." , megaProject:{proj:"C",step:4}},
          { id:"i2", text:"Enter one Kaggle competition start-to-finish and write up your approach", desc:"EDA, baseline, feature engineering, model selection, ensembling, and a write-up of your approach. Top-30% on a first competition is realistic and a meaningful signal. The write-up itself is important — it builds the habit of documenting ML decisions." },
          { id:"i3", text:"Publish a technical blog post — explain a system or paper clearly to a public audience", desc:"Write a clear 1500-word technical post about something you built or a paper you reproduced. Writing for a public audience forces precision and reveals gaps. Posts that explain things clearly get read and shared." },
          { id:"i4", text:"Submit a 4-page paper to a workshop at NeurIPS, ICML, or ICLR", desc:"Target a workshop aligned with your Marvell work (efficient ML, GenAI systems, agent evaluation). Workshop papers are 4-8 pages with 40-60% acceptance rates. Your first submission teaches the entire submission and review process." },
          { id:"i5", text:"Publish a model or dataset on HuggingFace Hub with a detailed model card", desc:"Fine-tune a model for a specific task (code generation, technical QA, EDA document parsing) and publish with a complete model card. Downloads and likes on Hub are a proxy for community impact and appear on your public profile." },
          { id:"i6", text:"Contribute a real feature or fix to LangChain, LlamaIndex, or HuggingFace", desc:"Fix a real bug or implement a real feature in a production open-source codebase. The code review process teaches production standards. Core contributors get noticed and recruited — it is a career accelerant." },
        ],
        extraReading:[
          { id:"e1", topic:"Research scientist vs applied scientist vs ML engineer — the differences", desc:"Eugene Yan breakdown: research scientists produce papers as primary output; applied scientists balance production impact with publishable research; ML engineers own production systems. Understanding where you want to end up shapes which projects to prioritise at Marvell.", url:"https://eugeneyan.com/writing/data-science-roles/" },
          { id:"e2", topic:"Andrej Karpathy recipe — debugging research code before you scale", desc:"Start simple, overfit a tiny dataset first, babysit your loss curves, avoid trying to be clever early. The discipline to follow this saves months of wasted compute. Required reading before running your first research experiment.", url:"http://karpathy.github.io/2019/04/25/recipe/" },
          { id:"e3", topic:"TensorTonic premium tier — ML interview prep for scientist roles", desc:"The premium tier adds company-specific ML interview questions relevant to Applied Scientist roles at major labs. Worth paying for when 12+ months in and actively targeting research-adjacent roles.", url:"https://www.tensortonic.com/" },
          { id:"e4", topic:"How to give a research talk — Kayvon Fatahalian guide", desc:"A great talk motivates the problem first (not the method), uses visual intuition over equations, gives the key insight in the first 5 minutes, and leaves the audience wanting to read the paper.", url:"http://graphics.cs.cmu.edu/nsp/course/15-869/fall14/pdfs/giving_a_talk.pdf" },
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

const MEGA_PROJECTS = {
  A: {
    id:"A", name:"From-Scratch Transformer", color:"#6366f1", bg:"#1e1b4b", border:"#4338ca", emoji:"🧠",
    totalSteps:6,
    subtitle:"Build a complete LLM — every component yours",
    nature:"from_scratch",
    steps:[
      "Tensor ops: matmul + SVD (mf1)",
      "Autograd engine: Value class + .backward() (c3)",
      "Neural net layers on your autograd (c3)",
      "Multi-head attention using your layers (c9)",
      "GPT decoder: assemble your components (c10)",
      "BPE tokenizer wired to your transformer (ra)",
    ]},
  B: {
    id:"B", name:"Production Agent System", color:"#3b82f6", bg:"#0f1e3d", border:"#1d4ed8", emoji:"🤖",
    totalSteps:6,
    subtitle:"Understand before abstracting, then ship",
    nature:"framework_assisted",
    steps:[
      "Async foundation: concurrent LLM calls (eng1)",
      "ReAct from scratch: raw loop, no frameworks (g2)",
      "RAG pipeline: add retrieval to your agent (g3)",
      "LangGraph upgrade: production state + memory (mv3)",
      "Eval: LLM-as-judge on your agent (mv3)",
      "Ship: FastAPI + SSE streaming endpoint (mv3)",
    ]},
  C: {
    id:"C", name:"Research Portfolio", color:"#ec4899", bg:"#2d0f1f", border:"#9d174d", emoji:"🔬",
    totalSteps:4,
    subtitle:"Independent showcase pieces — right tool for each",
    nature:"portfolio",
    steps:[
      "FNO solver: spectral conv from scratch (sci1)",
      "PatchCore: manufacturing vision inspector (sci3)",
      "ME GenAI: Project B skills, new domain (sci3)",
      "Paper reproduction: match results within 5% (rp1)",
    ]},
};

const RESOURCE_LINKS = {
  "3Blue1Brown — Backpropagation": "https://www.youtube.com/watch?v=Ilg3gGewQ5U",
  "3Blue1Brown — But what is the Fourier Transform? (YouTube)": "https://www.youtube.com/watch?v=spUNpyF58BY",
  "3Blue1Brown — CNNs": "https://www.youtube.com/watch?v=KuXjwB4LzSA",
  "3Blue1Brown — Divergence and Curl (YouTube)": "https://www.youtube.com/watch?v=rB83DpBJQsE",
  "3Blue1Brown — Eigenvectors": "https://www.youtube.com/watch?v=PFDu9oVAE-g",
  "3Blue1Brown — Essence of Linear Algebra": "https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab",
  "3Blue1Brown — NN Chapter 1": "https://www.youtube.com/watch?v=aircAruvnKk",
  "3Blue1Brown — What is Backpropagation?": "https://www.youtube.com/watch?v=Ilg3gGewQ5U",
  "APEX Calculus Vol.3, Ch.12-14 (free PDF)": "http://www.apexcalculus.com/downloads",
  "APEX Calculus Vol.3, Ch.14-15 (free PDF)": "http://www.apexcalculus.com/downloads",
  "APEX Calculus Vol.3, Ch.15-16 (free PDF)": "http://www.apexcalculus.com/downloads",
  "Abhishek Divekar — Engineer to Scientist": "https://medium.com/@ardivekar/engineer-to-ml-scientist-notes-on-a-2-year-journey-of-growth-ed4d16d22044",
  "Adam paper — Kingma & Ba 2015": "https://arxiv.org/abs/1412.6980",
  "Agent Frameworks Comparison 2025": "https://www.langchain.com/state-of-agent-engineering",
  "Andrew Ng — Agentic Design Patterns": "https://www.youtube.com/watch?v=sal78ACtGTc",
  "Andrew Ng — Coursera": "https://www.coursera.org/learn/machine-learning",
  "Anthropic Constitutional AI Paper": "https://arxiv.org/abs/2212.08073",
  "Anthropic MCP Docs": "https://modelcontextprotocol.io/introduction",
  "Atlassian Git Tutorials": "https://www.atlassian.com/git/tutorials/comparing-workflows",
  "AutoGen Docs": "https://microsoft.github.io/autogen/",
  "BERT Paper": "https://arxiv.org/abs/1810.04805",
  "BYOL — Grill et al. 2020": "https://arxiv.org/abs/2006.07733",
  "Barlow Twins — Zbontar et al. 2021": "https://arxiv.org/abs/2103.03230",
  "CS224N Research Project Guide": "https://web.stanford.edu/class/cs224n/project.html",
  "CS231n NumPy Tutorial": "https://cs231n.github.io/python-numpy-tutorial/",
  "CS231n — Backprop Notes": "https://cs231n.github.io/optimization-2/",
  "CS231n — CNN Notes": "https://cs231n.github.io/convolutional-networks/",
  "Chen et al. 2021 — Learning FEA Surrogates": "https://arxiv.org/abs/2105.04561",
  "Chinchilla — Hoffmann et al. 2022": "https://arxiv.org/abs/2203.15556",
  "Chip Huyen — Designing ML Systems": "https://stanford-cs329s.github.io/",
  "Chip Huyen — LLM Engineering": "https://huyenchip.com/2023/04/11/llm-engineering.html",
  "Chip Huyen — When to Fine-tune": "https://huyenchip.com/2023/04/11/llm-engineering.html",
  "Chris McCormick — Word2Vec Tutorial": "https://mccormickml.com/2016/04/19/word2vec-tutorial-the-skip-gram-model/",
  "Chris Olah — Understanding Convolutions": "https://colah.github.io/posts/2014-07-Understanding-Convolutions/",
  "Chris Olah — Understanding LSTMs": "https://colah.github.io/posts/2015-08-Understanding-LSTMs/",
  "Chris Olah — Visual Information Theory": "https://colah.github.io/posts/2015-09-Visual-Information/",
  "CrewAI Docs": "https://docs.crewai.com/",
  "DDPM — Ho et al. 2020": "https://arxiv.org/abs/2006.11239",
  "DINO — Caron et al. 2021": "https://arxiv.org/abs/2104.14294",
  "Dao et al. 2022 — FlashAttention": "https://arxiv.org/abs/2205.14135",
  "Dauphin et al. 2014": "https://arxiv.org/abs/1412.6544",
  "David Fan — Breaking into ML Research Without PhD": "https://davidfan.io/blog/2022/02/breaking-into-industry-ml-ai-research-without-a-phd/",
  "Deep Learning Book — Ch. 7": "https://www.deeplearningbook.org/contents/regularization.html",
  "DeepSeek-V3 Technical Report 2024": "https://arxiv.org/abs/2412.19437",
  "DiffSBDD — Schneuing et al. 2022": "https://arxiv.org/abs/2210.13695",
  "Ding et al. 2019 — Tool Wear Survey": "https://arxiv.org/abs/1910.07107",
  "Divekar — Notes on ML conferences": "https://medium.com/@ardivekar/engineer-to-ml-scientist-notes-on-a-2-year-journey-of-growth-ed4d16d22044",
  "FNO for Navier-Stokes — Li et al. 2021": "https://arxiv.org/abs/2010.08895",
  "FNO — Li et al. 2021": "https://arxiv.org/abs/2010.08895",
  "FastAPI Docs": "https://fastapi.tiangolo.com/",
  "Flash Attention Paper": "https://arxiv.org/abs/2205.14135",
  "Foret et al. 2021 — SAM": "https://arxiv.org/abs/2010.01412",
  "Frankle et al. 2020": "https://arxiv.org/abs/1803.03635",
  "FrugalGPT — Chen et al. 2023": "https://arxiv.org/abs/2305.05176",
  "Full Stack LLM Bootcamp": "https://fullstackdeeplearning.com/llm-bootcamp/",
  "GAN paper — Goodfellow et al. 2014": "https://arxiv.org/abs/1406.2661",
  "GPT-4 Technical Report 2023": "https://arxiv.org/abs/2303.08774",
  "GPTQ/AWQ papers": "https://arxiv.org/abs/2306.00978",
  "Gemini Technical Report 2023": "https://arxiv.org/abs/2312.11805",
  "Gilbert Strang — MIT 18.06": "https://www.youtube.com/playlist?list=PL49CF3715CB9EF31D",
  "Gilmer et al. 2017 — MPNN": "https://arxiv.org/abs/1704.01212",
  "Google Engineering Practices — Code Review": "https://google.github.io/eng-practices/review/",
  "GraphCast — Lam et al. 2023": "https://arxiv.org/abs/2212.12794",
  "Grieves & Vickers 2017 — Digital Twin": "https://www.sciencedirect.com/science/article/pii/S0360835221000115",
  "Hamel Husain — Evals blog": "https://hamel.dev/blog/posts/evals/",
  "Harvard NLP — Annotated Transformer": "https://nlp.seas.harvard.edu/annotated-transformer/",
  "Herde et al. 2024 — Poseidon": "https://arxiv.org/abs/2405.19101",
  "Hinton et al. 2015": "https://arxiv.org/abs/1503.02531",
  "Horace He — Making DL Go Brrr": "https://horace.io/brrr_intro.html",
  "How to Read a Paper — Keshav 2007": "https://web.stanford.edu/class/ee384m/Handouts/HowtoReadPaper.pdf",
  "HuggingFace — Open Science Guide": "https://huggingface.co/docs/hub/index",
  "HyenaDNA — Nguyen et al. 2023": "https://arxiv.org/abs/2306.15794",
  "InstructGPT Paper": "https://arxiv.org/abs/2203.02155",
  "InstructGPT — Ouyang et al. 2022": "https://arxiv.org/abs/2203.02155",
  "Jacot et al. 2018": "https://arxiv.org/abs/1806.07572",
  "Jake VanderPlas — PCA in Python": "https://jakevdp.github.io/PythonDataScienceHandbook/05.09-principal-component-analysis.html",
  "Jay Alammar — Illustrated BERT": "https://jalammar.github.io/illustrated-bert/",
  "Jay Alammar — Illustrated Transformer": "https://jalammar.github.io/illustrated-transformer/",
  "Jay Alammar — Visualising Attention": "https://jalammar.github.io/visualizing-neural-machine-translation-mechanics-of-seq2seq-models-with-attention/",
  "Jerry Liu — Advanced RAG": "https://www.llamaindex.ai/blog/a-cheat-sheet-and-some-recipes-for-building-advanced-rag-rag-cheat-sheet-96de63c09de7",
  "Jing et al. 2022 — DiffSBDD": "https://arxiv.org/abs/2210.13695",
  "Jumper et al. 2021 — AlphaFold 2": "https://www.nature.com/articles/s41586-021-03819-2",
  "Kaggle Learn + Competition Discussions": "https://www.kaggle.com/learn",
  "Karpathy — Intro to LLMs": "https://www.youtube.com/watch?v=zjkBMFhNj_g",
  "Karpathy — Let's Build GPT": "https://www.youtube.com/watch?v=kCc8FmEb1nY",
  "Karpathy — Unreasonable Effectiveness": "http://karpathy.github.io/2015/05/21/rnn-effectiveness/",
  "Karpathy — Zero to Hero": "https://www.youtube.com/playlist?list=PLAqhIrjkxbuWI23v9cThsA9GvCAUhRvKZ",
  "Karpathy — micrograd (YouTube)": "https://www.youtube.com/watch?v=VMj-3S1tku0",
  "Kiran et al. 2022 — RL for Industrial Control": "https://arxiv.org/abs/2110.01002",
  "LDM — Rombach et al. 2022": "https://arxiv.org/abs/2112.10752",
  "LLMLingua — Jiang et al. 2023": "https://arxiv.org/abs/2310.05736",
  "LLaVA Paper — Liu et al. 2023": "https://arxiv.org/abs/2304.08485",
  "LangChain Docs — Agents": "https://python.langchain.com/docs/concepts/agents/",
  "LangChain — Context Engineering 2025": "https://blog.langchain.com/context-engineering-for-agents/",
  "LangChain — State of Agent Engineering 2025": "https://www.langchain.com/state-of-agent-engineering",
  "LangGraph Docs": "https://langchain-ai.github.io/langgraph/",
  "Li et al. 2018": "https://arxiv.org/abs/1712.09913",
  "Lilian Weng — Agent Memory Survey": "https://lilianweng.github.io/posts/2023-06-23-agent/",
  "Lilian Weng — Attention? Attention!": "https://lilianweng.github.io/posts/2018-06-24-attention/",
  "Lilian Weng — LLM Agents": "https://lilianweng.github.io/posts/2023-06-23-agent/",
  "Lilian Weng — LLM Training": "https://lilianweng.github.io/posts/2021-09-25-train-large/",
  "LlamaIndex Docs": "https://www.llamaindex.ai/blog/a-cheat-sheet-and-some-recipes-for-building-advanced-rag-rag-cheat-sheet-96de63c09de7",
  "Lost in the Middle — Liu et al. 2023": "https://arxiv.org/abs/2307.03172",
  "Lu et al. 2021 — DeepONet": "https://arxiv.org/abs/1910.03193",
  "MAE — He et al. 2022": "https://arxiv.org/abs/2111.06377",
  "MIT 18.02 OCW — Notes": "https://ocw.mit.edu/courses/18-02sc-multivariable-calculus-fall-2010/",
  "MIT 18.03 OCW — Notes": "https://ocw.mit.edu/courses/18-03sc-differential-equations-fall-2011/",
  "MTEB Benchmark — HuggingFace": "https://huggingface.co/spaces/mteb/leaderboard",
  "MVTec AD Dataset — Bergmann et al. 2019": "https://www.mvtec.com/company/research/datasets/mvtec-ad",
  "Makatura et al. 2023 — Generative AI for Engineering": "https://arxiv.org/abs/2309.07605",
  "Mathematics for ML Book": "https://mml-book.github.io/",
  "Mathematics for ML Book Ch.5": "https://mml-book.github.io/",
  "Mildenhall et al. 2021 — NeRF": "https://arxiv.org/abs/2003.08934",
  "MoCo — He et al. 2020": "https://arxiv.org/abs/1911.05722",
  "Mode SQL Tutorial": "https://mode.com/sql-tutorial/",
  "NASA CMAPSS Dataset": "https://data.nasa.gov/Aerospace/CMAPSS-Jet-Engine-Simulated-Data/ff5v-kuh6",
  "NVIDIA AMP Docs": "https://developer.nvidia.com/automatic-mixed-precision",
  "NVIDIA Modulus Docs": "https://docs.nvidia.com/deeplearning/modulus/index.html",
  "Nakkiran et al. 2021": "https://arxiv.org/abs/1912.02292",
  "NeMo Guardrails": "https://github.com/NVIDIA/NeMo-Guardrails",
  "Nearing — Mathematical Tools, Ch.4 ODEs (free PDF)": "https://www-mdp.eng.cam.ac.uk/web/library/enginfo/textbooks_dvd_only/nearing/math_methods.pdf",
  "Nearing — Mathematical Tools, Ch.7 Fourier (free PDF)": "https://www-mdp.eng.cam.ac.uk/web/library/enginfo/textbooks_dvd_only/nearing/math_methods.pdf",
  "Nearing — Mathematical Tools, Ch.8 PDEs (free PDF)": "https://www-mdp.eng.cam.ac.uk/web/library/enginfo/textbooks_dvd_only/nearing/math_methods.pdf",
  "Nie et al. 2020 — TopologyGAN": "https://arxiv.org/abs/2003.04685",
  "NumPy Docs: Broadcasting": "https://numpy.org/doc/stable/user/basics.broadcasting.html",
  "ONNX Runtime Docs": "https://onnxruntime.ai/docs/",
  "OWASP LLM Top 10": "https://owasp.org/www-project-top-10-for-large-language-model-applications/",
  "OpenAI Agents Docs": "https://platform.openai.com/docs/guides/agents",
  "OpenAI o1 System Card 2024": "https://openai.com/index/openai-o1-system-card/",
  "Original Dropout Paper": "https://jmlr.org/papers/v15/srivastava14a.html",
  "Original ReAct Paper": "https://arxiv.org/abs/2210.03629",
  "Original Word2Vec Paper": "https://arxiv.org/abs/1301.3781",
  "Outlines Library Docs": "https://dottxt-ai.github.io/outlines/",
  "Pattern Recognition — Bishop Ch.1-2": "https://www.microsoft.com/en-us/research/uploads/prod/2006/01/Bishop-Pattern-Recognition-and-Machine-Learning-2006.pdf",
  "Paul's Online Math Notes — Laplace Transforms": "https://tutorial.math.lamar.edu/Classes/DE/DE.aspx",
  "Paul's Online Math Notes — Partial Derivatives": "https://tutorial.math.lamar.edu/Classes/CalcIII/CalcIII.aspx",
  "Pfaff et al. 2021 — MeshGraphNets": "https://arxiv.org/abs/2010.03409",
  "Pinecone — What is a Vector DB": "https://www.pinecone.io/learn/vector-database/",
  "Probability for ML — Goodfellow Appendix": "https://www.deeplearningbook.org/contents/prob.html",
  "Prompt Engineering Guide": "https://www.promptingguide.ai/",
  "PyTorch 60 Minute Blitz": "https://pytorch.org/tutorials/beginner/deep_learning_60min_blitz.html",
  "PyTorch Tensor Tutorial": "https://pytorch.org/tutorials/beginner/basics/tensorqs_tutorial.html",
  "Pydantic Docs": "https://docs.pydantic.dev/",
  "Python asyncio docs": "https://docs.python.org/3/library/asyncio.html",
  "Ragas Docs": "https://docs.ragas.io/",
  "Real Python — Advanced Python": "https://realpython.com/tutorials/advanced/",
  "Real Python — OOP in Python": "https://realpython.com/python3-object-oriented-programming/",
  "RealNVP — Dinh et al. 2017": "https://arxiv.org/abs/1605.08803",
  "Redis Semantic Cache Docs": "https://redis.io/docs/latest/develop/interact/search-and-query/",
  "Roth et al. 2022 — PatchCore": "https://arxiv.org/abs/2106.08265",
  "Sanchez-Gonzalez et al. 2020 — GNS": "https://arxiv.org/abs/2002.12327",
  "Santurkar et al. 2018": "https://arxiv.org/abs/1805.11604",
  "Score SDEs — Song et al. 2021": "https://arxiv.org/abs/2011.13456",
  "Sebastian Raschka — ML from Scratch": "https://github.com/rasbt/machine-learning-book",
  "SimCLR — Chen et al. 2020": "https://arxiv.org/abs/2002.05709",
  "Simon Peyton Jones — How to Write a Great Research Paper": "https://www.youtube.com/watch?v=VK51E3gHENc",
  "Stanford CS336 — Lecture 1": "https://www.youtube.com/playlist?list=PLoROMvodv4rOY23Y7RVmbIDnRIJqGFRSd",
  "Stanford CS336 — Lectures 13-14": "https://www.youtube.com/playlist?list=PLoROMvodv4rOY23Y7RVmbIDnRIJqGFRSd",
  "Stanford DSPy Paper": "https://arxiv.org/abs/2310.03714",
  "StatQuest — Logistic Regression": "https://www.youtube.com/watch?v=yIYKR4sgzI8",
  "StatQuest — PCA": "https://www.youtube.com/watch?v=FgakZw6K1QQ",
  "StatQuest — Regularisation": "https://www.youtube.com/watch?v=Q81RR3yKn30",
  "StatQuest — Word2Vec": "https://www.youtube.com/watch?v=viZrOnJclY0",
  "TechWorld with Nana — Docker for Beginners": "https://www.youtube.com/watch?v=3c-iBn73dDE",
  "TensorRT-LLM Docs": "https://docs.nvidia.com/deeplearning/tensorrt/index.html",
  "TensorRT-LLM Quantization Guide": "https://nvidia.github.io/TensorRT-LLM/blogs/quantization-in-TRT-LLM.html",
  "The Missing Semester — MIT": "https://missing.csail.mit.edu/",
  "Thomas et al. 2018 — Tensor Field Networks": "https://arxiv.org/abs/1802.08219",
  "VAE paper — Kingma & Welling 2014": "https://arxiv.org/abs/1312.6114",
  "Vaswani et al. — Attention is All You Need": "https://arxiv.org/abs/1706.03762",
  "ViT Paper": "https://arxiv.org/abs/2010.11929",
  "WGAN paper — Arjovsky et al. 2017": "https://arxiv.org/abs/1701.07875",
  "Wieder et al. 2020 — Compact Survey": "https://arxiv.org/abs/2012.05716",
  "ZenML — 1200 Production Deployments 2025": "https://www.zenml.io/blog/what-1200-production-deployments-reveal-about-llmops-in-2025",
  "Zhou et al. — Agentic AI Engineering": "https://arxiv.org/abs/2402.01030",
  "a16z — LLM cost analysis": "https://a16z.com/navigating-the-generative-ai-infrastructure-stack/",
  "vLLM Docs": "https://docs.vllm.ai/en/latest/",
  "vLLM — PagedAttention Blog": "https://vllm.ai/blog/2023/06/20/vllm.html",
};

const TYPE_BADGE = {
  youtube: { label:"▶ YouTube",  bg:"#3d1212", color:"#f85149" },
  paper:   { label:"📝 Paper",   bg:"#2d1b3d", color:"#d2a8ff" },
  blog:    { label:"✍ Blog",    bg:"#0d1f2d", color:"#58a6ff" },
  docs:    { label:"📄 Docs",    bg:"#1a1f2e", color:"#a5d6ff" },
  course:  { label:"🎓 Course",  bg:"#1a1208", color:"#d29922" },
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
            {resource && !isLink && (() => {
            const rUrl = RESOURCE_LINKS[resource];
            return rUrl
              ? <a href={rUrl} target="_blank" rel="noreferrer" onClick={e=>e.stopPropagation()} style={{ fontSize:10, color:C.accent, background:C.elevated, padding:"1px 6px", borderRadius:99, flexShrink:0, textDecoration:"none", border:`1px solid ${C.border}`, whiteSpace:"nowrap" }}>↗ {resource}</a>
              : <span style={{ fontSize:10, color:C.dim, background:C.elevated, padding:"1px 6px", borderRadius:99, flexShrink:0 }}>{resource}</span>;
          })()}
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
  const [rFilter, setRFilter] = useState("all");
  const [openBuild, setOpenBuild] = useState({});

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
          <div style={{fontSize:11,color:C.dim,marginTop:3,lineHeight:1.4}}>MTech → Marvell GenAI → Research</div>
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
          {[["roadmap","📋  Roadmap"],["resources","🔗  Resources"],["build","⚙️  Build"],["stats","📊  Stats"]].map(([v,l])=>(
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
                  <span style={{fontSize:12,color:phDone===phase.items.length?C.green:C.dim,background:phDone===phase.items.length?"#0d1f0f":C.elevated,padding:"2px 8px",borderRadius:99,border:`1px solid ${phDone===phase.items.length?"#238636":C.border2}`}}>{phDone}/{phase.items.length}</span>
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
                          <div style={{display:"flex",gap:8,marginTop:12,flexWrap:"wrap",justifyContent:"center",padding:"10px 0 2px",borderTop:`1px solid ${C.border}`}} onClick={e=>e.stopPropagation()}>
                            {SECS.map(sec=>{
                              const active = curSec===sec.key;
                              return (
                                <button key={sec.key} onClick={()=>setSection(item.id,sec.key)} style={{padding:"7px 18px",borderRadius:8,border:`1.5px solid ${active?sec.color:C.border}`,background:active?sec.color+"22":"transparent",color:active?sec.color:C.muted,fontSize:14,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:6,transition:"all 0.15s",letterSpacing:0.1}}>
                                  <span style={{fontSize:15}}>{sec.emoji}</span>
                                  <span>{sec.label}</span>
                                  {sec.stats && sec.stats.total>0 && <span style={{background:active?sec.color+"33":C.elevated,borderRadius:99,padding:"1px 8px",fontSize:12,fontWeight:600,minWidth:28,textAlign:"center"}}>{sec.stats.checked}/{sec.stats.total}</span>}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Section content */}
                    {isOpen && curSec && (
                      <div style={{margin:"0 16px 12px 16px",background:C.surface,borderRadius:8,border:`1px solid ${C.border}`,padding:"14px 16px"}}>
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


        {/* ── RESOURCES VIEW ── */}
        {view==="resources" && (() => {
          const resTab = rFilter.startsWith("x:") ? "extra" : "main";
          const typeFilter = rFilter.startsWith("x:") ? rFilter.slice(2) : rFilter;

          const allMain = ROADMAP.flatMap(phase =>
            phase.items.flatMap(item =>
              (item.resources||[]).map(r => ({...r, itemId:item.id, itemTitle:item.title, phase:phase.phase, phaseColor:phase.color, isExtra:false}))
            )
          );
          const allExtra = ROADMAP.flatMap(phase =>
            phase.items.flatMap(item =>
              (item.extraReading||[]).map(e => ({...e, id:e.id, text:e.topic, url:e.url||"", type:"extra", itemId:item.id, itemTitle:item.title, phase:phase.phase, phaseColor:phase.color, isExtra:true, desc:e.desc}))
            )
          );

          const pool = resTab==="extra" ? allExtra : allMain;
          const filtered = typeFilter==="all" ? pool : pool.filter(r=>r.type===typeFilter);

          const mainTypes = ["all","youtube","course","paper","blog","docs"];
          const EXTRA_BADGE = {label:"✨ Extra",bg:"#2d1b3d",color:"#a371f7"};

          // Group by phase
          const grouped = ROADMAP.map(phase => ({
            phase: phase.phase,
            color: phase.color,
            items: filtered.filter(r => r.phase === phase.phase)
          })).filter(g => g.items.length > 0);

          const totalChecked = resTab==="extra"
            ? allExtra.filter(e=>checks[`${e.itemId}__extra__${e.id}`]).length
            : allMain.filter(r=>checks[`${r.itemId}__resources__${r.id}`]).length;

          return (
            <div>
              {/* Header */}
              <div style={{marginBottom:16}}>
                <div style={{fontSize:22,fontWeight:700,color:C.text,marginBottom:4}}>Resources</div>
                <div style={{fontSize:14,color:C.dim}}>{totalChecked}/{pool.length} completed in current view</div>
              </div>

              {/* Main tab switcher */}
              <div style={{display:"flex",gap:3,marginBottom:14,background:C.elevated,padding:3,borderRadius:9,width:"fit-content"}}>
                {[["main","📚  Resources"],["extra","✨  Extra Reading"]].map(([tab,label])=>(
                  <button key={tab} onClick={()=>setRFilter(tab==="main"?"all":"x:all")}
                    style={{padding:"5px 14px",borderRadius:7,border:"none",cursor:"pointer",fontSize:14,fontWeight:600,
                      background: resTab===tab ? C.surface : "transparent",
                      color: resTab===tab ? C.text : C.dim,
                      boxShadow: resTab===tab ? "0 1px 3px rgba(0,0,0,0.3)" : "none",
                      transition:"all 0.15s"}}>
                    {label}
                  </button>
                ))}
              </div>

              {/* Type filter chips — only for main resources */}
              {resTab==="main" && (
                <div style={{display:"flex",gap:5,marginBottom:14,flexWrap:"wrap"}}>
                  {mainTypes.map(t=>{
                    const count = t==="all" ? allMain.length : allMain.filter(r=>r.type===t).length;
                    const badge = TYPE_BADGE[t]||{label:"All",bg:C.elevated,color:C.muted};
                    const active = typeFilter===t;
                    return (
                      <button key={t} onClick={()=>setRFilter(t)}
                        style={{padding:"3px 11px",borderRadius:99,border:`1px solid ${active?(badge.color||C.accent):C.border}`,
                          background:active?(badge.bg||C.elevated):"transparent",
                          color:active?(badge.color||C.accent):C.dim,fontSize:14,fontWeight:600,cursor:"pointer"}}>
                        {t==="all"?"All ✦":badge.label}
                        <span style={{opacity:0.55,fontSize:14,marginLeft:4}}>{count}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Grouped by phase */}
              {grouped.length===0 && (
                <div style={{color:C.dim,fontSize:15,textAlign:"center",padding:"32px 0"}}>No resources match this filter.</div>
              )}
              {grouped.map(group=>(
                <div key={group.phase} style={{marginBottom:10,border:`1px solid ${C.border}`,borderRadius:10,overflow:"hidden"}}>
                  {/* Phase header */}
                  <div style={{padding:"9px 14px",background:C.surface,borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:8}}>
                    <div style={{width:8,height:8,borderRadius:"50%",background:group.color,flexShrink:0}}/>
                    <span style={{fontWeight:700,fontSize:15,color:C.text}}>{group.phase}</span>
                    <span style={{fontSize:15,color:C.dim,background:C.elevated,padding:"1px 7px",borderRadius:99,marginLeft:"auto"}}>
                      {group.items.filter(r=>resTab==="extra"?checks[`${r.itemId}__extra__${r.id}`]:checks[`${r.itemId}__resources__${r.id}`]).length}/{group.items.length}
                    </span>
                  </div>
                  {/* Items */}
                  {group.items.map((r,i)=>{
                    const checkKey = resTab==="extra" ? `${r.itemId}__extra__${r.id}` : `${r.itemId}__resources__${r.id}`;
                    const checked = !!checks[checkKey];
                    const badge = resTab==="extra" ? EXTRA_BADGE : (TYPE_BADGE[r.type]||{label:r.type,bg:C.elevated,color:C.dim});
                    const handleCheck = ()=> resTab==="extra" ? toggleCheck(r.itemId,"extra",r.id) : toggleCheck(r.itemId,"resources",r.id);
                    return (
                      <div key={`${r.itemId}-${r.id}`} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"9px 14px",borderBottom:i<group.items.length-1?`1px solid ${C.border2}`:"none",background:checked?"#0d150d":"transparent",transition:"background 0.15s"}}>
                        <div onClick={handleCheck} style={{flexShrink:0,width:15,height:15,borderRadius:3,marginTop:3,
                          border:`1.5px solid ${checked?(resTab==="extra"?"#9333ea":"#238636"):C.border}`,
                          background:checked?(resTab==="extra"?"#9333ea":"#238636"):"transparent",
                          cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
                          {checked && <span style={{color:"#fff",fontSize:15,fontWeight:800,lineHeight:1}}>✓</span>}
                        </div>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{display:"flex",alignItems:"flex-start",gap:6,flexWrap:"wrap",marginBottom:2}}>
                            {r.url ? (
                              <a href={r.url} target="_blank" rel="noreferrer"
                                style={{fontSize:15,color:checked?C.dim:C.accent,textDecoration:checked?"line-through":"underline",lineHeight:1.5,wordBreak:"break-word"}}>
                                {r.text}
                              </a>
                            ) : (
                              <span style={{fontSize:15,color:checked?C.dim:"#c9a5ff",lineHeight:1.5}}>{r.text}</span>
                            )}
                            <span style={{fontSize:14,padding:"1px 6px",borderRadius:99,background:badge.bg,color:badge.color,flexShrink:0,marginTop:2}}>{badge.label}</span>
                          </div>
                          <div style={{fontSize:14,color:C.dim}}>{r.itemTitle}</div>
                          {resTab==="extra" && r.desc && (
                            <div style={{fontSize:15,color:C.muted,marginTop:3,lineHeight:1.5}}>{r.desc.length>160?r.desc.slice(0,160)+"…":r.desc}</div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          );
        })()}

        {/* ── BUILD VIEW ── */}
        {view==="build" && (() => {
          const allBuilds = ROADMAP.flatMap(phase =>
            phase.items.flatMap(item =>
              (item.implementation||[]).map(b => ({...b, itemId:item.id, itemTitle:item.title, phase:phase.phase, phaseColor:phase.color}))
            )
          );
          const total_b = allBuilds.length;
          const done_b = allBuilds.filter(b=>checks[`${b.itemId}__implementation__${b.id}`]).length;
          const megaByProj = {A:[], B:[], C:[]};
          allBuilds.forEach(b=>{ if(b.megaProject) megaByProj[b.megaProject.proj]?.push(b); });
          return (
            <div>
              <div style={{marginBottom:16}}>
                <div style={{fontSize:22,fontWeight:700,color:C.text,marginBottom:4}}>All Build Tasks</div>
                <div style={{fontSize:14,color:C.dim,marginBottom:8}}>{done_b}/{total_b} completed across the roadmap</div>
                <div style={{background:C.elevated,borderRadius:99,height:4}}>
                  <div style={{background:`linear-gradient(90deg,${C.yellow},#f59e0b)`,width:`${Math.round((done_b/total_b)*100)}%`,height:"100%",borderRadius:99,transition:"width 0.4s"}}/>
                </div>
              </div>

              {/* ── Mega Project Cards ── */}
              <div style={{marginBottom:20}}>
                <div style={{fontSize:15,fontWeight:700,color:C.dim,textTransform:"uppercase",letterSpacing:0.7,marginBottom:8}}>Mega Projects</div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
                  {Object.values(MEGA_PROJECTS).map(mp=>{
                    const steps = megaByProj[mp.id]||[];
                    const doneSteps = steps.filter(b=>checks[`${b.itemId}__implementation__${b.id}`]).length;
                    return (
                      <div key={mp.id} style={{background:mp.bg,border:`1px solid ${mp.border}`,borderRadius:10,padding:"12px 14px"}}>
                        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}>
                          <span style={{fontSize:15}}>{mp.emoji}</span>
                          <span style={{fontSize:14,fontWeight:700,color:mp.color,lineHeight:1.3}}>{mp.name}</span>
                        </div>
                        {/* Step progress bar */}
                        <div style={{display:"flex",gap:3,marginBottom:7}}>
                          {Array.from({length:mp.totalSteps},(_,i)=>{
                            const stepBuild = steps.find(b=>b.megaProject?.step===i+1);
                            const isDone = stepBuild ? !!checks[`${stepBuild.itemId}__implementation__${stepBuild.id}`] : false;
                            return <div key={i} title={mp.steps[i]} style={{flex:1,height:5,borderRadius:3,background:isDone?mp.color:`${mp.color}22`,transition:"background 0.3s"}}/>;
                          })}
                        </div>
                        <div style={{fontSize:14,color:mp.color,opacity:0.75,marginBottom:7}}>{doneSteps}/{mp.totalSteps} steps complete</div>
                        {/* Step checklist */}
                        {mp.steps.map((stepLabel,i)=>{
                          const stepBuild = steps.find(b=>b.megaProject?.step===i+1);
                          const isDone = stepBuild ? !!checks[`${stepBuild.itemId}__implementation__${stepBuild.id}`] : false;
                          return (
                            <div key={i} style={{display:"flex",alignItems:"flex-start",gap:6,marginBottom:4}}>
                              <div style={{width:14,height:14,borderRadius:"50%",flexShrink:0,marginTop:1,
                                border:`1.5px solid ${isDone?mp.color:`${mp.color}35`}`,
                                background:isDone?mp.color:"transparent",
                                display:"flex",alignItems:"center",justifyContent:"center"}}>
                                {isDone
                                  ? <span style={{color:"#fff",fontSize:14,fontWeight:800,lineHeight:1}}>✓</span>
                                  : <span style={{fontSize:14,color:mp.color,opacity:0.5,fontWeight:700}}>{i+1}</span>}
                              </div>
                              <span style={{fontSize:14,color:isDone?mp.color:C.dim,textDecoration:isDone?"line-through":"none",lineHeight:1.35}}>{stepLabel}</span>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ── All tasks by phase ── */}
              {ROADMAP.map(phase=>{
                const phBuilds = phase.items.flatMap(item=>(item.implementation||[]).map(b=>({...b,itemId:item.id,itemTitle:item.title})));
                if(!phBuilds.length) return null;
                const phDone_b = phBuilds.filter(b=>checks[`${b.itemId}__implementation__${b.id}`]).length;
                return (
                  <div key={phase.phase} style={{marginBottom:10,border:`1px solid ${C.border}`,borderRadius:10,overflow:"hidden"}}>
                    <div style={{padding:"9px 14px",background:C.surface,display:"flex",alignItems:"center",gap:8,borderBottom:`1px solid ${C.border}`}}>
                      <div style={{width:7,height:7,borderRadius:"50%",background:phase.color}}/>
                      <span style={{fontWeight:700,fontSize:15,color:C.text}}>{phase.phase}</span>
                      <span style={{fontSize:15,color:C.dim,background:C.elevated,padding:"1px 7px",borderRadius:99,marginLeft:"auto"}}>{phDone_b}/{phBuilds.length}</span>
                    </div>
                    <div style={{padding:"4px 0"}}>
                      {phBuilds.map((b,i)=>{
                        const checked = !!checks[`${b.itemId}__implementation__${b.id}`];
                        const mp = b.megaProject ? MEGA_PROJECTS[b.megaProject.proj] : null;
                        const isOpen_b = openBuild[`${b.itemId}-${b.id}`];
                        return (
                          <div key={`${b.itemId}-${b.id}`} style={{padding:"8px 14px",borderBottom:i<phBuilds.length-1?`1px solid ${C.border2}`:"none",background:checked?"#0d150d":"transparent"}}>
                            <div style={{display:"flex",alignItems:"flex-start",gap:9,cursor:"pointer"}} onClick={()=>setOpenBuild(p=>({...p,[`${b.itemId}-${b.id}`]:!p[`${b.itemId}-${b.id}`]}))}>
                              <div onClick={e=>{e.stopPropagation();toggleCheck(b.itemId,"implementation",b.id);}} style={{flexShrink:0,width:15,height:15,borderRadius:3,marginTop:3,
                                border:`1.5px solid ${checked?"#9e6a03":C.border}`,background:checked?"#2d2208":"transparent",
                                cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
                                {checked && <span style={{color:C.yellow,fontSize:15,fontWeight:800,lineHeight:1}}>✓</span>}
                              </div>
                              <div style={{flex:1,minWidth:0}}>
                                <div style={{display:"flex",alignItems:"flex-start",gap:6,flexWrap:"wrap",marginBottom:2}}>
                                  <span style={{fontSize:15,color:checked?C.dim:C.text,textDecoration:checked?"line-through":"none",lineHeight:1.45,flex:1}}>{b.text}</span>
                                  {mp && (
                                    <span title={`Step ${b.megaProject.step}: ${mp.steps[b.megaProject.step-1]}`}
                                      style={{fontSize:14,padding:"1px 8px",borderRadius:99,background:mp.bg,color:mp.color,
                                        border:`1px solid ${mp.border}`,flexShrink:0,whiteSpace:"nowrap",cursor:"default"}}>
                                      {mp.emoji} {b.megaProject.step}/{mp.totalSteps}
                                    </span>
                                  )}
                                  {b.desc && <span style={{fontSize:14,color:C.dim,flexShrink:0,marginTop:2}}>{isOpen_b?"▲":"▼"}</span>}
                                </div>
                                {mp && <div style={{fontSize:14,color:mp.color,opacity:0.65,marginBottom:2}}>{mp.name} · Step {b.megaProject.step}: {mp.steps[b.megaProject.step-1]}</div>}
                                <div style={{fontSize:14,color:C.dim,display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
                                  <span>{b.itemTitle}</span>
                                  {b.resource && (() => {
                                    const rUrl = RESOURCE_LINKS[b.resource];
                                    return rUrl
                                      ? <a href={rUrl} target="_blank" rel="noreferrer" onClick={e=>e.stopPropagation()} style={{fontSize:12,color:C.accent,background:C.elevated,padding:"1px 7px",borderRadius:99,textDecoration:"none",border:`1px solid ${C.border}`}}>↗ {b.resource}</a>
                                      : <span style={{fontSize:12,color:C.dim,background:C.elevated,padding:"1px 7px",borderRadius:99}}>{b.resource}</span>;
                                  })()}
                                </div>
                              </div>
                            </div>
                            {isOpen_b && b.desc && (
                              <div style={{marginLeft:24,marginTop:5,fontSize:14,color:C.muted,lineHeight:1.6,
                                background:C.bg,borderLeft:`2px solid ${mp?mp.color:C.yellow}40`,
                                paddingLeft:10,paddingTop:4,paddingBottom:4,borderRadius:"0 4px 4px 0"}}>{b.desc}</div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })()}

                {/* ── STATS VIEW ── */}
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
                  <div style={{fontSize:14,fontWeight:700,color:c.color,marginTop:3,textTransform:"uppercase",letterSpacing:0.5}}>{c.label}</div>
                </div>
              ))}
            </div>

            <div style={{background:C.surface,borderRadius:10,border:`1px solid ${C.border}`,padding:"16px"}}>
              <div style={{fontWeight:700,fontSize:15,marginBottom:14,color:C.text}}>Progress by Phase</div>
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
                        <span style={{fontSize:14,fontWeight:600,color:C.muted}}>{phase.phase}</span>
                      </div>
                      <div style={{display:"flex",gap:12}}>
                        <span style={{fontSize:14,color:C.dim}}>{totalChecks}/{totalPossible} tasks</span>
                        <span style={{fontSize:14,color:C.dim}}>{phDone}/{phase.items.length} concepts</span>
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
              <div style={{fontWeight:700,fontSize:15,marginBottom:12,color:C.text}}>Your Notes</div>
              {ALL_ITEMS.filter(i=>notes[i.id]).length===0 ? (
                <div style={{color:C.dim,fontSize:14,textAlign:"center",padding:"14px 0"}}>No notes yet. Use 📝 on any concept.</div>
              ) : ALL_ITEMS.filter(i=>notes[i.id]).map(item=>(
                <div key={item.id} style={{marginBottom:9,padding:"9px 11px",background:C.bg,borderRadius:7,borderLeft:`2px solid ${C.accent}`}}>
                  <div style={{fontSize:14,fontWeight:700,color:C.text,marginBottom:2}}>{item.title}</div>
                  <div style={{fontSize:14,color:C.muted,lineHeight:1.6}}>{notes[item.id]}</div>
                </div>
              ))}
            </div>

            <div style={{textAlign:"center"}}>
              <button onClick={async()=>{
                if(!confirm("Reset all progress, checks, and notes?")) return;
                setProgress({}); setChecks({}); setNotes({});
                try{await store.set("p","{}"); await store.set("c","{}"); await store.set("n","{}");} catch{}
              }} style={{fontSize:15,color:C.red,background:"transparent",border:`1px solid #5a1e1e`,borderRadius:6,padding:"6px 13px",cursor:"pointer"}}>Reset Everything</button>
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