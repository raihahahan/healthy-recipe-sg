"use client";

import { useState } from "react";
import styles from "./page.module.css";
import { Button } from "@mantine/core";

const NINJA_API_KEY: string = process.env.NEXT_PUBLIC_NINJA_API_KEY as string;
const RECIPE_URL = "https://api.api-ninjas.com/v1/recipe?query=healthy";

const COLDSTORAGE_SEARCH = (item: string) =>
  `https://coldstorage.com.sg/en/search?keyword=${item}s&page=1`;
const NTUC_SEARCH = (item: string) =>
  `https://www.fairprice.com.sg/search?query=${item}`;
const SS_SEARCH = (item: string) => `https://shengsiong.com.sg/search/${item}`;

interface Recipe {
  title: string;
  ingredients: string;
  servings: string;
  instructions: string;
}

async function getRandomRecipe(): Promise<Recipe | null> {
  try {
    console.log(NINJA_API_KEY);
    const res = await fetch(RECIPE_URL, {
      method: "GET",
      headers: { "X-Api-Key": NINJA_API_KEY },
    });

    const recipes = await res.json();
    const randomRecipe = recipes[Math.floor(Math.random() * recipes.length)];

    return randomRecipe;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export default function Home() {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <div className={styles.page}>
      <Button
        onClick={async () => {
          setRecipe(null);
          setLoading(true);
          const _recipe = await getRandomRecipe();
          setRecipe(_recipe);
          setLoading(false);
        }}
      >
        Give me a random healthy recipe 👨‍🍳
      </Button>

      {loading && <h3>Loading...</h3>}

      {recipe && (
        <div>
          <h1>{recipe.title}</h1>
          <br />
          <h2>Ingredients</h2>
          {recipe.ingredients.split("|").map((r) => {
            const regex = /(?:\d+\s?\/?\d*\s?\w*\s)?([A-Za-z\s'-]+?)(?:;|$)/;
            const match = r.match(regex);
            const simplified = match ? match[1].trim() : "";

            return (
              <div key={r}>
                {r}:{" "}
                <a
                  style={{ color: "blue" }}
                  target="_blank"
                  href={NTUC_SEARCH(simplified)}
                >
                  NTUC
                </a>{" "}
                |{" "}
                <a
                  style={{ color: "blue" }}
                  target="_blank"
                  href={SS_SEARCH(simplified)}
                >
                  Sheng Shiong
                </a>{" "}
                |{" "}
                <a
                  style={{ color: "blue" }}
                  href={COLDSTORAGE_SEARCH(simplified)}
                  target="_blank"
                >
                  Cold Storage
                </a>
              </div>
            );
          })}
          <br />
          <h2>Instructions</h2>
          {recipe.instructions.split(". ").map((i) => {
            return <div key={i}>{i}</div>;
          })}
          <br />
          <h2>Servings: {recipe.servings}</h2>
        </div>
      )}
    </div>
  );
}
