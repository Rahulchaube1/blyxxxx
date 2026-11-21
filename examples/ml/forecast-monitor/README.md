# Train a forecast and monitor its errors

This native Blyx program fits a line with LinearFit, calibrates an 80% prediction interval with Conformal, and uses ResidualWatch to detect sustained underprediction as outcomes arrive. The training, calibration and monitoring rows are disjoint.

Install Blyx 0.2.1, Rust 1.85 or later and a host linker. The [starter ZIP](https://www.blyx-lang.space/examples/forecast-monitor.zip) includes the pinned Blyx source dependencies. Extract it and run `blyxc native-run main.blyx` from the project folder.

If you are using this Git checkout, fetch the three tagged modules from this directory before running the program.

```sh
git clone --depth 1 --branch v0.1.1 https://github.com/Rahulchaube1/blyx-linearfit.git vendor/linearfit
git clone --depth 1 --branch v0.1.0 https://github.com/Rahulchaube1/blyx-conformal.git vendor/conformal
git clone --depth 1 --branch v0.1.0 https://github.com/Rahulchaube1/blyx-residualwatch.git vendor/residualwatch
blyxc native-run main.blyx
```

```text
21
19
23
0
1
```

The model predicts 21 at x = 10. The five absolute calibration errors are 1, 0, 1, 2 and 2. Their fifth order statistic gives a radius of 2 and an interval from 19 to 23. Split-conformal coverage assumes exchangeable calibration and future examples. ResidualWatch uses the signed calibration errors as its baseline. The last two outputs show the monitoring decisions. The first large positive error does not cross the threshold. The second triggers an upward alert.

[Training and monitoring handbook](https://doc.blyx-lang.space/guide/training-and-monitoring) · [Blyx package catalog](https://www.blyx-lang.space/packages)

## Connect with Rahul Chaube

[Portfolio](https://www.rahulchaube1.com/) · [GitHub](https://github.com/Rahulchaube1) · [LinkedIn](https://www.linkedin.com/in/rahulchaube1) · [Hugging Face](https://huggingface.co/oncody) · [X](https://x.com/RahulChaube_) · [EverestQ](https://www.everestqai.com/) · [Contact](https://www.rahulchaube1.com/contact)

[Blyx website](https://www.blyx-lang.space/) · [BlyxTorch](https://www.blyx-lang.space/packages/blyxtorch) · [Handbook](https://doc.blyx-lang.space/) · [Community](https://www.blyx-lang.space/community)

Support Rahul’s open-source work through [GitHub Sponsors](https://github.com/sponsors/Rahulchaube1) or [Buy Me a Coffee](https://buymeacoffee.com/rahulchaube).
