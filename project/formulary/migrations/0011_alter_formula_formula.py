# Generated by Django 4.1.3 on 2022-12-06 10:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('formulary', '0010_alter_variable_variable'),
    ]

    operations = [
        migrations.AlterField(
            model_name='formula',
            name='formula',
            field=models.CharField(max_length=100),
        ),
    ]