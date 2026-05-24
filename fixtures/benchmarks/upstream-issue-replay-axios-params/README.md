# Upstream Issue Replay Benchmark: Axios Params

This fixture replays the public Axios issue `axios/axios#6189`: nested empty
object parameters were omitted when Axios serialized a plain params object.

Source: https://github.com/axios/axios/issues/6189

The benchmark starts with a minimal serializer that drops empty object leaves,
then applies `expected.patch` and reruns tests that require those leaves to be
preserved as explicit empty query assignments.
