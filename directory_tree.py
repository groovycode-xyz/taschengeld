import os
import sys

def is_hidden(filepath):
    """
    Determine whether a file or directory is hidden.
    Works for both Unix and Windows systems.
    """
    if sys.platform.startswith('win'):
        import ctypes
        FILE_ATTRIBUTE_HIDDEN = 0x02
        try:
            attrs = ctypes.windll.kernel32.GetFileAttributesW(str(filepath))
            if attrs == -1:
                return False
            return bool(attrs & FILE_ATTRIBUTE_HIDDEN)
        except Exception:
            return False
    else:
        return os.path.basename(filepath).startswith('.')

def generate_tree(root_path, prefix=''):
    """
    Recursively generates the directory and file tree.

    Args:
        root_path (str): The root directory path.
        prefix (str): The string prefix for the current level.

    Returns:
        list: A list of strings representing the directory tree.
    """
    tree = []
    try:
        entries = os.listdir(root_path)
    except PermissionError:
        tree.append(f"{prefix}└── [Permission Denied]")
        return tree
    except Exception as e:
        tree.append(f"{prefix}└── [Error: {e}]")
        return tree

    # Sort entries: directories first, then files, both alphabetically
    entries.sort(key=lambda x: (not os.path.isdir(os.path.join(root_path, x)), x.lower()))

    entries_count = len(entries)
    for index, entry in enumerate(entries):
        path = os.path.join(root_path, entry)
        connector = "├── " if index < entries_count - 1 else "└── "
        is_dir = os.path.isdir(path)
        hidden = is_hidden(path)
        display_name = f"{entry} {'(hidden)' if hidden else ''}" if hidden else entry

        tree.append(f"{prefix}{connector}{display_name}")

        if is_dir:
            extension = "│   " if index < entries_count - 1 else "    "
            tree.extend(generate_tree(path, prefix + extension))
    return tree

def main():
    # Determine the root directory as the current working directory
    root_dir = os.path.abspath(os.getcwd())

    if not os.path.exists(root_dir):
        print(f"Error: The directory '{root_dir}' does not exist.")
        sys.exit(1)
    if not os.path.isdir(root_dir):
        print(f"Error: The path '{root_dir}' is not a directory.")
        sys.exit(1)

    tree = [root_dir]
    tree.extend(generate_tree(root_dir))

    tree_output = "\n".join(tree)

    # Define the output file name
    output_file = "directory_tree.txt"

    try:
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(tree_output)
        print(f"Directory tree has been written to '{output_file}'.")
    except Exception as e:
        print(f"Error writing to file: {e}")

if __name__ == "__main__":
    main()