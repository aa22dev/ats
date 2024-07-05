import os

def print_directory_structure(root_dir, indent='', exclude_dirs=None):
    if exclude_dirs is None:
        exclude_dirs = []

    items = sorted(os.listdir(root_dir))
    dirs = [name for name in items if os.path.isdir(os.path.join(root_dir, name)) and name not in exclude_dirs]
    files = [name for name in items if os.path.isfile(os.path.join(root_dir, name))]

    items = dirs + files

    for index, name in enumerate(items):
        path = os.path.join(root_dir, name)
        if name in exclude_dirs:
            continue

        if index == len(items) - 1:
            prefix = '└── '
            next_indent = indent + '    '
        else:
            prefix = '├── '
            next_indent = indent + '│   '

        print(indent + prefix + name)

        if os.path.isdir(path):
            print_directory_structure(path, next_indent, exclude_dirs)

if __name__ == "__main__":
    print_directory_structure('.', exclude_dirs=['node_modules', '.git', '.idea', '__pycache__', 'locale'])

