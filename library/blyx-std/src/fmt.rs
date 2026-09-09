pub fn format_table(headers: &[&str], rows: &[Vec<String>]) -> String {
    let mut widths = vec![0; headers.len()];
    for (i, h) in headers.iter().enumerate() {
        widths[i] = h.len();
    }
    for row in rows {
        for (i, cell) in row.iter().enumerate() {
            if i < widths.len() && cell.len() > widths[i] {
                widths[i] = cell.len();
            }
        }
    }

    let mut res = String::new();
    for (i, h) in headers.iter().enumerate() {
        res.push_str(&pad_right(h, widths[i]));
        res.push_str(" | ");
    }
    res.push('\n');
    for w in &widths {
        res.push_str(&repeat_str("-", *w));
        res.push_str("-|-");
    }
    res.push('\n');

    for row in rows {
        for (i, cell) in row.iter().enumerate() {
            if i < widths.len() {
                res.push_str(&pad_right(cell, widths[i]));
                res.push_str(" | ");
            }
        }
        res.push('\n');
    }
    res
}

pub fn pad_left(s: &str, width: usize) -> String {
    if s.len() >= width {
        s.to_string()
    } else {
        format!("{}{}", repeat_str(" ", width - s.len()), s)
    }
}

pub fn pad_right(s: &str, width: usize) -> String {
    if s.len() >= width {
        s.to_string()
    } else {
        format!("{}{}", s, repeat_str(" ", width - s.len()))
    }
}

pub fn truncate(s: &str, max_len: usize) -> String {
    if s.len() > max_len {
        format!("{}...", &s[..max_len.saturating_sub(3)])
    } else {
        s.to_string()
    }
}

pub fn repeat_str(s: &str, n: usize) -> String {
    s.repeat(n)
}

pub fn indent(s: &str, spaces: usize) -> String {
    let pad = repeat_str(" ", spaces);
    s.lines().map(|l| format!("{}{}", pad, l)).collect::<Vec<_>>().join("\n")
}

pub fn word_wrap(s: &str, width: usize) -> Vec<String> {
    let mut res = Vec::new();
    for line in s.lines() {
        let mut curr = String::new();
        for word in line.split_whitespace() {
            if curr.len() + word.len() + 1 > width {
                res.push(curr.trim_end().to_string());
                curr = String::new();
            }
            curr.push_str(word);
            curr.push(' ');
        }
        if !curr.is_empty() {
            res.push(curr.trim_end().to_string());
        }
    }
    res
}
