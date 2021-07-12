# create-a-discussion javascript action

This action creates a GitHub repository discussion from a MD template.

## Inputs

### `category`

**Optional** The discussion categury to create the discussion in. Default `"General"`.

### `filename`

**Optional** The filepath to the markdown template for the discussion. Default `"./.github/DISCUSSION_TEMPLATE.md"`.

### `discussion-body`

**Optional** The content of the discussion body as a string. Either `discussion-body` or the `filename` should be passed

### `title`

**Required** The title of the discussion to be created.

### `title-date`

**Optional** Pass `true` to include the date at the end of the discussion title (i.e. `My Discussion for the week of Thursday, May 6th, 2021`). Default is not to include the date.

## Outputs

N/A.

## Example usage

```
- name: Create discussion
  id: create_discussion
  uses: keisaacson/create-a-discussion@v0.0.0
  env:
    GITHUB_REPOSITORY: ${{ secrets.GITHUB_REPOSITORY }}
    DISCUSSIONS_TOKEN: ${{ secrets.GH_DISCUSSIONS_TOKEN }}
  with:
    category: "Show and tell"
    filename: "./.github/DEMO_DISCUSSION_TEMPLATE.md"
    title: "Demos for the week of "
    title-date: true
```
