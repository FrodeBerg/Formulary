# Generated by Django 4.1.3 on 2022-11-30 19:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('formulary', '0003_alter_formula_product_alter_formula_using'),
    ]

    operations = [
        migrations.AlterField(
            model_name='category',
            name='name',
            field=models.CharField(max_length=50),
        ),
    ]
