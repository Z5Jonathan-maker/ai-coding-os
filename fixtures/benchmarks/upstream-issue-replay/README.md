# Upstream Issue Replay Benchmark

This fixture replays the public Luxon issue
`moment/luxon#1070`: decimal-hour durations formatted as `hh:mm` drifted one
minute low because fractional minutes were floored after floating-point math.

Source: https://github.com/moment/luxon/issues/1070

The benchmark starts with a minimal implementation that reproduces the reported
failure, then applies `expected.patch` and reruns the tests.
