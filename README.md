# Annotation Action

[![GitHub Super-Linter](https://github.com/actions/typescript-action/actions/workflows/linter.yml/badge.svg)](https://github.com/super-linter/super-linter)
![CI](https://github.com/actions/typescript-action/actions/workflows/ci.yml/badge.svg)
[![Check dist/](https://github.com/actions/typescript-action/actions/workflows/check-dist.yml/badge.svg)](https://github.com/actions/typescript-action/actions/workflows/check-dist.yml)

This GitHub Action lets you create annotations in [Axiom](https://axiom.co/).
For more information, see the
[Axiom documentation](https://axiom.co/docs/query-data/annotate-charts).

You can configure GitHub Actions using YAML syntax. For more information, see
the
[GitHub documentation](https://docs.github.com/en/actions/learn-github-actions/understanding-github-actions#create-an-example-workflow).

## Prerequisites

- [Create an Axiom account](https://app.axiom.co/).
- [Create a dataset](https://axiom.co/docs/reference/datasets) with the name
  `my-dataset`.
- [Create an advanced API token in Axiom with permissions to update dashboards](https://axiom.co/docs/reference/tokens).
- [Send data to your Axiom dataset](https://axiom.co/docs/send-data/ingest).

## Create annotations with GitHub Actions

To create an annotation when a deployment happens in GitHub, follow these steps:

1. Add the following to the end of your GitHub Action file:

   ```yml
   - name: Add annotation in Axiom when a deployment happens
     uses: axiomhq/annotation-action@v0.1.0
     with:
       axiomToken: ${{ secrets.API_TOKEN }}
       datasets: DATASET_NAME
       type: 'production-release'
       time: '2024-01-01T00:00:00Z' # optional, defaults to now
       endTime: '2024-01-01T01:00:00Z' # optional, defaults to null
       title: 'Production deployment' # optional
       description: 'Commit ${{ github.event.head_commit.message }}' # optional
       url: 'https://example.com' # optional, defaults to job url
   ```

2. In the code above, replace the following:

   - Replace `DATASET_NAME` with the Axiom dataset where you want to send data.
     To add the annotation to more than one dataset, enter a string of Axiom
     dataset names separated by commas. For example
     `axiom_datasets: 'DATASET_NAME_1, DATASET_NAME_2, DATASET_NAME_3'`.
   - Replace `API_TOKEN` with your Axiom API token. Add this token to your
     secrets.

3. Customize the other fields of the code above such as the title, the
   description, and the URL.

This creates an annotation in Axiom each time you deploy in GitHub.

This action has the ID of the annotation as an output, read the
[ci.yaml](https://github.com/axiomhq/annotation-action/blob/main/.github/workflows/ci.yml)
to see how to use it.
