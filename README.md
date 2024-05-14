# Annotation Action

[![GitHub Super-Linter](https://github.com/actions/typescript-action/actions/workflows/linter.yml/badge.svg)](https://github.com/super-linter/super-linter)
![CI](https://github.com/actions/typescript-action/actions/workflows/ci.yml/badge.svg)
[![Check dist/](https://github.com/actions/typescript-action/actions/workflows/check-dist.yml/badge.svg)](https://github.com/actions/typescript-action/actions/workflows/check-dist.yml)

This action allows you to create an annotation in Axiom.

## Usage

1. Create an Axiom API token with permission to create annotations
1. Create your annotation:

```yaml
- name: Create annotation
  uses: axiomhq/annotation-action@v1
  with:
    axiomToken: ${{ secrets.AXIOM_TOKEN }}
    datasets: production-logs
    type: "production-release"
    time: "2024-01-01T00:00:00Z"            # optional, defaults to now
    endTime: "2024-01-01T01:00:00Z"         # optional, defaults to null
    title: "Production release"             # optional
    description: "Commit ${{ github.sha }}" # optional
    url: "https://axiom.co"                 # optional, defaults to job url
```

This action has the ID of the annotation as an output, read the
[ci.yaml](https://github.com/axiomhq/annotation-action/blob/main/.github/workflows/ci.yml)
to see how to use it.
