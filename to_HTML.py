import markdown
import bs4
import os
 
def markdown_to_html(text):
    return markdown.markdown(text)

try:
    file_list = os.listdir("./my_blog")
except:
    os.mkdir("./my_blog")
    file_list = os.listdir("./my_blog")
print(file_list)
for i in file_list:
    aaa = i.split(".")
    # 示例Markdown文本
    markdown_file = open("./my_blog/"+i,"r",encoding="utf-8")
    markdown_text = markdown_file.read()
    markdown_file.close()

    # 转换Markdown到HTML
    html_text = markdown_to_html(markdown_text)
    file = open(aaa[0]+".html","w",encoding="utf-8")
    file.write(html_text)
    file.close()

    with open('index.html','r',encoding="utf-8") as f:
        text = f.read()
    soup = bs4.BeautifulSoup(text,'html.parser')
    new_a = soup.new_tag("a",href="./"+aaa[0]+".html",align="center")
    new_a.string = aaa[0]
    br = soup.new_tag("br")
    soup.body.div.append(new_a)
    soup.body.div.append(br)
    new_html = soup.prettify()
    with open('index.html','w',encoding="utf-8") as f:
        f.write(new_html)
